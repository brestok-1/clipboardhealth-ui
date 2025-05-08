import React from "react";

const CallCardSkeleton = () => {
  return (
    <div
      className="border rounded-lg p-3 flex flex-col w-full shadow-lg bg-white"
      style={{ minHeight: "200px" }}
    >
      <div className="p-2 flex flex-col gap-4 w-full">
        <div className="h-5 w-32 bg-gray-200 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col gap-2 flex-[2]">
            <div className="h-4 w-24 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-48 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-36 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-40 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-[2]">
            <div className="h-4 w-24 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-48 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-36 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-40 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-[1] gap-y-5">
            <div className="h-4 w-20 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="w-16 h-16 rounded-full bg-gray-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <div className="h-10 w-32 bg-gray-200 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default CallCardSkeleton; 