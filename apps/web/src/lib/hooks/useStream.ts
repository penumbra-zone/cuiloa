/**
 * Code taken (with slight modification) from Valorem Lab's react-hooks library: https://github.com/valorem-labs-inc/react-hooks/blob/main/src/hooks/useStream.ts
 * All credit to the original authors.
 *
 * MIT License
 * Copyright (c) 2023 Valorem Labs Inc.
 */
import {
  Message,
  MethodInfoServerStreaming,
  MethodInfoUnary,
  PartialMessage,
  ServiceType,
  toPlainMessage,
} from "@bufbuild/protobuf";
import type {
  CallOptions,
  StreamResponse,
  Transport,
} from "@connectrpc/connect";
import { ConnectError } from "@connectrpc/connect";
import { ConnectQueryKey, DisableQuery, disableQuery } from "@connectrpc/connect-query";
import { useTransport } from "@connectrpc/connect-query";
import { createAsyncIterable } from "@connectrpc/connect/protocol";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

/** Defines a standalone method and associated service  */
export type MethodUnaryDescriptor<
  I extends Message<I>,
  O extends Message<O>,
> = MethodInfoUnary<I, O> & {
  readonly service: Omit<ServiceType, "methods">;
};

/**
 * TanStack Query requires query keys in order to decide when the query should automatically update.
 *
 * In Connect-Query, much of this is handled automatically by this function.
 *
 * @see ConnectQueryKey for information on the components of Connect-Query's keys.
 */
export function createConnectQueryKey<
  I extends Message<I>,
  O extends Message<O>,
>(
  methodDescriptor: Pick<MethodUnaryDescriptor<I, O>, "I" | "name" | "service">,
  input?: DisableQuery | PartialMessage<I> | undefined,
): ConnectQueryKey<I> {
  return [
    methodDescriptor.service.typeName,
    methodDescriptor.name,
    toPlainMessage(
      new methodDescriptor.I(input === disableQuery || !input ? {} : input),
    ),
  ];
}

export type MethodServerStreamingDescriptor<
  I extends Message<I>,
  O extends Message<O>,
> = MethodInfoServerStreaming<I, O> & {
  readonly service: Omit<ServiceType, "methods">;
};

export interface StreamResponseMessage<T> {
  /** List of responses in chronological order */
  responses: T[];
  /** Indicates if the stream is completed or not. */
  done: boolean;
}

function handleStreamResponse<I extends Message<I>, O extends Message<O>>(
  stream: Promise<StreamResponse<I, O>>,
  options?: CallOptions,
): AsyncIterable<O> {
  // eslint-disable-next-line func-names -- generator function
  const it = (async function* () {
    const response = await stream;
    options?.onHeader?.(response.header);
    yield* response.message;
    options?.onTrailer?.(response.trailer);
  })()[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]: () => ({
      next: () => it.next(),
    }),
  };
}

type CreateServerStreamingQueryOptions<
  I extends Message<I>,
  O extends Message<O>,
  SelectOutData = StreamResponseMessage<O>,
> = {
  transport: Transport;
  callOptions?: Omit<CallOptions, "signal"> | undefined;
} & Omit<
  UseQueryOptions<
    StreamResponseMessage<O>,
    ConnectError,
    SelectOutData,
    ConnectQueryKey<I>
  >,
  "queryFn" | "queryKey"
>;

/**
 * A React hook to manage gRPC streaming within components. It handles opening and closing streams,
 * updating response states, and manages errors. The hook also integrates with react-query for global state management.
 *
 * @param config - Configuration object for the gRPC streaming process.
 * @returns Object containing stream data, response handling functions, and any errors encountered.
 */
export const useStream = <
  I extends Message<I>,
  O extends Message<O>,
  SelectOutData = StreamResponseMessage<O>,
>(
  methodSig: MethodServerStreamingDescriptor<I, O>,
  input?: PartialMessage<I>,
  {
    transport,
    callOptions,
    onResponse,
    timeoutMs = 15000,
    ...queryOptions
  }: Omit<
    CreateServerStreamingQueryOptions<I, O, SelectOutData>,
    "transport"
  > & {
    transport?: Transport;
    onResponse?: (response: O) => void;
    timeoutMs?: number;
  } = {},
) => {
  const ctxTransport = useTransport();
  const finalTransport = transport ?? ctxTransport;

  const queryClient = useQueryClient();
  const queryKey = createConnectQueryKey(methodSig, input);

  // const logger = useLogger();

  const streamIdRef = useRef<number>(0);

  return useQuery({
    ...queryOptions,
    queryKey,
    queryFn: async ({ signal: reactQuerySignal }) => {
      let responses: O[] = [];
      const streamId = streamIdRef.current;
      streamIdRef.current += 1;

      reactQuerySignal?.addEventListener("abort", () => {
        console.debug(`Stream #${streamId} aborted due to react-query abort`);
      });
      const timeoutSignal = createTimeoutSignal(
        timeoutMs,
        // logger,
        streamId,
      );
      const signal = mergeAbortSignals([reactQuerySignal, timeoutSignal]);

      console.debug(`Starting stream #${streamId}.`);

      try {
        for await (const res of handleStreamResponse(
          finalTransport.stream<I, O>(
            {
              typeName: methodSig.service.typeName,
              methods: {},
            },
            methodSig,
            signal,
            callOptions?.timeoutMs,
            callOptions?.headers,
            createAsyncIterable([input ?? {}]),
          ),
        )) {
          console.debug(
            `Received${
              Object.keys(res).length === 0 ? " empty " : " "
            }response for stream #${streamId}`,
            { res },
          );
          onResponse?.(res); // Handle the response.
          responses = [res, ...responses];
          const newData: StreamResponseMessage<O> = {
            done: false,
            responses,
          };
          queryClient.setQueriesData({ queryKey }, newData);
        }

        return {
          done: true,
          responses,
        } satisfies StreamResponseMessage<O>;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("Stream aborted due to timeout");
        }
        console.error(ConnectError.from(error));
        throw new Error(JSON.stringify(ConnectError.from(error)));
      } finally {
        console.log(`Stream #${streamId} is closed...`);
      }
    },
  });
};

function createTimeoutSignal(
  timeoutMs: number,
  // logger?: ReturnType<typeof useLogger>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  streamId: number,
) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  // timeoutSignal.addEventListener("abort", () => {
  //   logger.debug(`Stream #${streamId} aborted due to timeout`);
  // });
  return timeoutSignal;
}

function mergeAbortSignals(signals: (AbortSignal | undefined)[]) {
  const controller = new AbortController();
  const { signal: mergedSignal } = controller;

  const abortListeners = signals.map((signal) => {
    const abortListener = () => {
      controller.abort();
      cleanup();
    };
    signal?.addEventListener("abort", abortListener);
    return abortListener;
  });

  const cleanup = () => {
    abortListeners.forEach((listener, i) => {
      signals[i]?.removeEventListener("abort", listener);
    });
  };

  mergedSignal.addEventListener("abort", cleanup);

  return mergedSignal;
}
