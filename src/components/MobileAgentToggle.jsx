import React from 'react';

const MobileUserToggle = ({ selectedTab, handleTabClick }) => {
  return (
    <div className="md:hidden w-full my-2 flex items-center justify-center">
      <div className="flex w-full max-w-xs bg-white rounded-full overflow-hidden shadow">
        <button
          className={`w-1/2 py-2 px-4 text-center ${
            selectedTab === 1 
            ? 'bg-blue-100 text-blue-700 font-semibold' 
            : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick(1)}
        >
          Calls
        </button>
        <button
          className={`w-1/2 py-2 px-4 text-center ${
            selectedTab === 2 
            ? 'bg-blue-100 text-blue-700 font-semibold' 
            : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick(2)}
        >
          Statistics
        </button>
      </div>
    </div>
  );
};

export default MobileUserToggle; 