import BlocksTable from "@/components/BlocksTable";

export const dynamic = "force-dynamic";

const Page = () => {

  return (
    <div>
      <h1 className="text-lg font-bold">Recent Blocks</h1>
      <BlocksTable />
    </div>
  );
};

export default Page;