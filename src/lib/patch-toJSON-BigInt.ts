/**
 * This file is a one-off monkey patch to BigInt's prototype for toJSON.
 * 
 * As defined, there is no way to serialize BigInt via JSON.stringify()[0] and this creates a nested set of problems because of how PrismaJS handles database columns with BigInt as their type[1].
 * IME combined with tooling like server middleware, PrismaJS client, data query libraries, and NextJS's routing, JSON.stringify's "Do not know how to serialize a BigInt" error is easily suppressed
 * and lost in the runtime stack trace. This patch is the solution.
 * 
 * WARNING: Please make sure to import this at the top level of the project, ie app/layout.tsx, or otherwise any API route that returns a data payload with BigInt properties is liable to fail and/or misbehave.
 * 
 * [0]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
 * [1]: https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields#serializing-bigint
*/

// @ts-expect-error: toJSON is a native implementation so TS is unhappy when we manipulate something it doesn't see.
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function() { return this.toString() };