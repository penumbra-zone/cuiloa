import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col gap-5 items-center pt-5 bg-primary/60">
      <h1 className="text-lg font-bold">Available IBC data to explore</h1>
      <div className="flex w-full justify-around">
        <p className="font-bold underline">
          <Link href="/ibc/clients">
            IBC Clients
          </Link>
        </p>
        <p className="font-bold underline">
          <Link href="/ibc/channels">
            IBC Channels
          </Link>
        </p>
        <p className="font-bold underline">
          <Link href="/ibc/connections">
            IBC Connections
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
