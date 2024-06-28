import TransactionsTable from "@/components/TransactionsTable";

export const dynamic = "force-dynamic";

const Page = async () => {
  return (
    <div className="bg-primary flex flex-col gap-5 pt-5 items-center">
      <h1 className="sm:text-2xl font-bold">Recent Transactions</h1>
      <TransactionsTable className="sm:w-11/12 w-full"/>
    </div>
  );
};

export default Page;
