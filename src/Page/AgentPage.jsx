import React, { useState, useEffect, useRef } from "react";
import HeaderComponent from "../components/HeaderComponent";
import {
   filterCalls,
   filterStatistics,
   getAllCalls,
   getAllStatistics,
} from "../api/agentApi";

import FiltersComponent from "../components/FiltersComponent";
import Cards from "../components/Cards";
import MobileAgentToggle from "../components/MobileAgentToggle";

const ITEMS_PER_PAGE = 10;

const AgentPage = () => {
   const [selectedTab, setSelectedTab] = useState(1);
   const [filters, setFilters] = useState(null);
   const [data, setData] = useState([]);
   const [error, setError] = useState(null);
   const [page, setPage] = useState(0);
   const [totalCount, setTotalCount] = useState(0);
   const [expandedCardId, setExpandedCardId] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const scrollRef = useRef(null);

   useEffect(() => {
      setPage(0);
   }, [filters]);

   const fetchData = async (tab, currentPage) => {
      setError(null);
      setIsLoading(true);
      setExpandedCardId(null);
      
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
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchData(selectedTab, page);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
   }, [selectedTab, page, filters]);

   const handleTabClick = (tab) => {
      if (selectedTab !== tab) {
         setSelectedTab(tab);
         setPage(0);
         setExpandedCardId(null);
      }
   };

   const handlePreviousPage = () => {
      if (page > 0) {
         setPage(page - 1);
         setExpandedCardId(null);
      }
   };

   const handleNextPage = () => {
      const maxPage = Math.ceil(totalCount / ITEMS_PER_PAGE) - 1;
      if (page < maxPage) {
         setPage(page + 1);
         setExpandedCardId(null);
      }
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
      <div className="w-screen h-screen flex bg-gray-100 flex-col overflow-hidden">
         <HeaderComponent />

         <div className="flex flex-col md:flex-row flex-1 p-3 md:p-6 gap-3 md:gap-6 overflow-hidden">
            <div className="hidden md:flex w-1/6 border border-gray-300 py-6 px-2 rounded-3xl flex-col items-start gap-2 bg-white shadow">
               {renderTabButton(1, "Calls")}
               {renderTabButton(2, "Statistics")}
            </div>

            {/* Мобильный переключатель вкладок */}
            <MobileAgentToggle 
               selectedTab={selectedTab} 
               handleTabClick={handleTabClick} 
            />

            <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
               {/* Фильтры */}
               <div className="border border-gray-300 rounded-3xl p-3 md:p-4 bg-white shadow flex items-center justify-end">
                  <FiltersComponent
                     selectedTab={selectedTab}
                     setFilters={setFilters}
                  />
               </div>

               {/* Основное содержимое */}
               <div className="flex-[9] bg-gray-100 overflow-hidden flex flex-col">
                  <div className="overflow-y-auto relative flex-1" ref={scrollRef}>
                     {!isLoading && data.length === 0 ? (
                        <div className="text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl text-center">
                           No data
                        </div>
                     ) : (
                        <Cards 
                           data={data} 
                           selectedTab={selectedTab} 
                           expandedCardId={expandedCardId}
                           setExpandedCardId={setExpandedCardId}
                           isLoading={isLoading}
                        />
                     )}
                  </div>
                  
                  {/* Пагинация */}
                  {!isLoading && data.length > 0 && (
                     <div className="flex justify-between items-center border-t py-2">
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
                              className="w-6 h-6 md:w-8 md:h-8 text-blue-900"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M15.75 19.5 8.25 12l7.5-7.5"
                              />
                           </svg>
                        </button>
                        <span className="text-base md:text-lg font-medium">
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
                              className="w-6 h-6 md:w-8 md:h-8 text-blue-900"
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
