import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 w-full h-full">
      <Skeleton className="min-w-[300px] sm:min-w-[500px] h-[150px] rounded-lg"/>
      <Skeleton className="w-full min-h-[350px] rounded-lg"/>
      <Skeleton className="min-w-[200px] min-h-[100px] rounded-lg"/>
    </div>
  );
}
