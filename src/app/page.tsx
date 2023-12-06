import Link from "next/link";

export default async function Home() {

  return (
    <div className="flex flex-col gap-5 items-center pt-5">
      <h1 className="text-lg font-bold">Available Views</h1>
      <div className="flex w-full justify-around">
        <p className="font-bold underline">
          <Link href="/transactions">
            Recent Transactions
          </Link>
        </p>
        <p className="font-bold underline">
          <Link href="/blocks">
            Recent Blocks
          </Link>
        </p>
      </div>
    </div>
  );
}
