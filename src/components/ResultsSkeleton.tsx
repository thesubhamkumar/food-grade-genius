
import { Skeleton } from "@/components/ui/skeleton";

const ResultsSkeleton = () => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          {/* Product image skeleton */}
          <Skeleton className="w-24 h-24 flex-shrink-0 rounded-md" />
          
          <div className="flex-grow text-center md:text-left">
            {/* Product name skeleton */}
            <Skeleton className="h-8 w-3/4 mx-auto md:mx-0 mb-2" />
            
            {/* Brand skeleton */}
            <Skeleton className="h-4 w-1/2 mx-auto md:mx-0" />
          </div>
          
          {/* Health grade skeleton */}
          <div className="flex flex-col items-center">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Nutrition facts skeleton */}
        <Skeleton className="h-6 w-40 mb-4" />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
        
        {/* Progress bars skeleton */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
          <div>
            <div className="flex justify-between mb-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
        
        {/* Ingredients skeleton */}
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-20 w-full mb-6" />
        
        {/* Health information skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        {/* Recommendation skeleton */}
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default ResultsSkeleton;
