import Skeleton from "@/components/Skeleton";

export default function ItemDetailsLoading() {
  return (
    <div>
      <div className="flex h-14 items-center justify-between px-4">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <div className="h-5 w-5" />
      </div>

      <div className="px-4 pt-4">
        <Skeleton className="mb-4 h-56 w-full rounded-xl" />
        <Skeleton className="mb-2 h-6 w-2/3" />
        <Skeleton className="mb-1.5 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}
