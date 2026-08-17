import Skeleton from "@/components/Skeleton";

export default function MyItemsLoading() {
  return (
    <div>
      <div className="flex h-14 items-center justify-between px-4">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-24" />
        <div className="h-5 w-5" />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}
