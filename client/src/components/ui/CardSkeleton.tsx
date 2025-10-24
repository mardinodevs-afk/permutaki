import { Skeleton } from "./skeleton";

export default function CardSkeleton() {
  return (
    <div className="p-3 border rounded-md bg-card">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/5 mb-2" />
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
