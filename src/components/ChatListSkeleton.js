import React from 'react';

const ChatListSkeleton = () => {
  const skeletonItems = Array(6).fill(0);
  
  return (
    <>
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="rounded-lg w-full py-2 px-3 my-2 flex items-center justify-between cursor-pointer overflow-hidden"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-5 h-5 bg-gray-300 rounded relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <div className="h-4 w-3/4 bg-gray-300 rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatListSkeleton; 