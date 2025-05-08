import React, { useState, useEffect } from "react";
import HeaderComponent from "../components/HeaderComponent";
import {
   filterCalls,
   filterStatistics,
   getAllCalls,
   getAllStatistics,
} from "../api/agentApi";

import FiltersComponent from "../components/FiltersComponent";
import Cards from "../components/Cards";

const ITEMS_PER_PAGE = 5;

const AgentPage = () => {
   const [selectedTab, setSelectedTab] = useState(1);
   const [filters, setFilters] = useState(null);
   const [data, setData] = useState([]);
   const [error, setError] = useState(null);
   const [page, setPage] = useState(0);
   const [totalCount, setTotalCount] = useState(0);

   useEffect(() => {
      setPage(0);
   }, [filters]);

   const fetchData = async (tab, currentPage) => {
      setError(null);
      try {
         let response;

         if (tab === 1) {
            if (filters && filters.length > 0) {
               response = await filterCalls(
                  filters,
                  ITEMS_PER_PAGE,
                  currentPage
               );
            } else {
               response = await getAllCalls(ITEMS_PER_PAGE, currentPage);
            }
         } else if (tab === 2) {
            if (filters && filters.length > 0) {
               response = await filterStatistics(
                  filters,
                  ITEMS_PER_PAGE,
                  currentPage
               );
            } else {
               response = await getAllStatistics(ITEMS_PER_PAGE, currentPage);
            }
         }

         if (response.statusCode === 200) {
            if (tab === 1) {
               setData(response.data.calls || []);
               setTotalCount(response.data.paging.totalCount || 0);
            } else if (tab === 2) {
               setData(response.data.statistics || []);
               setTotalCount(response.data.paging.totalCount || 0);
            }
         } else {
            throw new Error(`Error: ${response.error.message}`);
         }
      } catch (err) {
         setError(err.message);
      }
   };

   useEffect(() => {
      fetchData(selectedTab, page);
   }, [selectedTab, page, filters]);

   const handleTabClick = (tab) => {
      setSelectedTab(tab);
      setPage(0);
   };

   const handlePreviousPage = () => {
      if (page > 0) setPage(page - 1);
   };

   const handleNextPage = () => {
      const maxPage = Math.ceil(totalCount / ITEMS_PER_PAGE) - 1;
      if (page < maxPage) setPage(page + 1);
   };

   const renderTabButton = (tab, label) => (
      <button
         className={`w-full px-4 py-2 text-left text-xl rounded-md ${
            selectedTab === tab ? "text-blue-700" : "hover:bg-gray-100"
         }`}
         onClick={() => handleTabClick(tab)}
      >
         {label}
      </button>
   );

   return (
      <div className="w-screen h-screen flex flex-col overflow-hidden">
         <HeaderComponent />

         <div className="flex flex-1 p-6 gap-6 overflow-hidden">
            <div className="w-1/6 border border-gray-300 py-6 px-2 rounded-3xl flex flex-col items-start gap-2 bg-white shadow">
               {renderTabButton(1, "Calls")}
               {renderTabButton(2, "Statistics")}
            </div>

            <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
               <div className="flex-[1] border border-gray-300 rounded-3xl p-4 bg-white shadow flex items-center justify-end">
                  <FiltersComponent
                     selectedTab={selectedTab}
                     setFilters={setFilters}
                  />
               </div>

               <div className="flex-[9] bg-white overflow-hidden flex flex-col">
                  <div className="overflow-y-auto relative flex-1">
                     {data.length === 0 ? (
                        <div className="text-gray-500 absolute top-1/2 right-1/2 text-xl">
                           No data
                        </div>
                     ) : (
                        <Cards data={data} selectedTab={selectedTab} />
                     )}
                  </div>
                  {data.length > 0 && (
                     <div className="flex justify-between items-center border-t">
                        <button
                           onClick={handlePreviousPage}
                           disabled={page === 0}
                           className="py-2 text-white rounded disabled:opacity-50"
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-8 h-8 text-blue-900"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M15.75 19.5 8.25 12l7.5-7.5"
                              />
                           </svg>
                        </button>
                        <span className="text-lg font-medium">
                           {page + 1} / {Math.ceil(totalCount / ITEMS_PER_PAGE)}
                        </span>
                        <button
                           onClick={handleNextPage}
                           disabled={
                              page >= Math.ceil(totalCount / ITEMS_PER_PAGE) - 1
                           }
                           className="py-2 text-white rounded disabled:opacity-50"
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-8 h-8 text-blue-900"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="m8.25 4.5 7.5 7.5-7.5 7.5"
                              />
                           </svg>
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default AgentPage;
