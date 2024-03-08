import TransactionsTable from "@/components/TransactionsTable";

export const dynamic = "force-dynamic";

const Page = async () => {
  return (
    <div className="flex flex-col gap-5 pt-5">
      <h1 className="sm:text-2xl font-bold self-center">Recent Transactions</h1>
      <TransactionsTable className="self-center sm:w-11/12 w-full"/>
    </div>
  );
};

export default Page;