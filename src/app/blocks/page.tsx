import BlocksTable from "@/components/BlocksTable";

export const dynamic = "force-dynamic";

const Page = () => {

  return (
    <div className="flex flex-col gap-5 pt-5">
      <h1 className="sm:text-2xl font-bold self-center">Recent Blocks</h1>
      <BlocksTable className="self-center sm:w-2/3 w-full"/>
    </div>
  );
};

export default Page;
