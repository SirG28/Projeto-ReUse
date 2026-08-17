import Skeleton from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      <div className="flex h-14 items-center justify-between px-4">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>

      <div className="px-4 pt-3">
        <Skeleton className="mb-[18px] h-[150px] w-full rounded-2xl" />

        <Skeleton className="mb-3 h-5 w-20" />
        <div className="mb-[18px] flex gap-2.5">
          <Skeleton className="h-[106px] w-[118px] shrink-0 rounded-xl" />
          <Skeleton className="h-[106px] w-[118px] shrink-0 rounded-xl" />
          <Skeleton className="h-[106px] w-[118px] shrink-0 rounded-xl" />
        </div>

        <Skeleton className="mb-3 h-5 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-[170px] w-[170px] shrink-0 rounded-xl" />
          <Skeleton className="h-[170px] w-[170px] shrink-0 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
