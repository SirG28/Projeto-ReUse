import Skeleton from "@/components/Skeleton";

export default function ProfileLoading() {
  return (
    <div>
      <div className="flex h-14 items-center border-b border-reuse-header-border px-4">
        <Skeleton className="h-5 w-16" />
      </div>

      <div className="flex flex-col items-center px-5 pt-3">
        <Skeleton className="mb-1.5 h-14 w-14 rounded-full" />
        <Skeleton className="mb-1 h-5 w-40" />
        <Skeleton className="mb-3 h-3 w-52" />
        <Skeleton className="mb-3 h-40 w-full rounded-2xl" />
        <Skeleton className="mb-1.5 h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
