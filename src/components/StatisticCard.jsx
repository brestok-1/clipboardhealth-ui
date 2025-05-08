import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import { PeriodType } from "../static/enums/PeriodType";
import { getStatisticById } from "../api/agentApi";
import { StatisticsType } from "../static/enums/StatisticsType";

const StatisticCard = ({ statistic, isExpanded, onToggleExpand }) => {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState(null);

   useEffect(() => {
      if (isExpanded && !data) {
         const fetchData = async () => {
            try {
               setLoading(true);
               const response = await getStatisticById(statistic.id);
               setData(response.data);
            } catch (error) {
               console.error("Error fetching statistic by ID:", error);
            } finally {
               setLoading(false);
            }
         };
         
         fetchData();
      }
   }, [isExpanded, statistic.id, data]);

   const periodLabel =
      Object.keys(PeriodType).find(
         (key) => PeriodType[key] === statistic.type
      ) || "-";

   const getEmojisByType = (type) => {
      if ([1, 2].includes(type)) {
         return { labelEmoji: "⏱️", callsEmoji: "⏳" };
      } else if ([3, 4].includes(type)) {
         return { labelEmoji: "📞", callsEmoji: "#️⃣" };
      } else if ([5, 6].includes(type)) {
         return { labelEmoji: "🌟", callsEmoji: "🥇" };
      }
      return { labelEmoji: "", callsEmoji: "" };
   };

   const renderLoadingSkeleton = () => (
      <div className="flex flex-col gap-2">
         {[1, 2].map((_, index) => (
            <div key={index}>
               <div className="h-4 w-36 bg-gray-200 rounded-md mt-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
               </div>
               {[1, 2].map((_, i) => (
                  <div key={i} className="pl-2 mt-4">
                     <div className="h-4 w-48 bg-gray-200 rounded-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
                     </div>
                     <div className="h-4 w-36 bg-gray-200 mt-2 rounded-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
                     </div>
                  </div>
               ))}
            </div>
         ))}
      </div>
   );

   const handleToggleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleExpand();
   };

   return (
      <div
         className="border rounded-lg p-3 flex flex-col w-full shadow-lg bg-white"
         style={{ minHeight: "150px" }}
      >
         <div className="p-2 flex flex-col gap-4 w-full">
            <div className="text-gray-600 text-lg font-semibold">
               <p>{formatDate(statistic.datetimeInserted)}</p>
            </div>
            <p className="flex items-center gap-1">
               <span className="font-medium">Type:</span> <strong className="bg-blue-100 px-2 py-1 rounded-full text-blue-800 text-sm">{periodLabel}</strong>
            </p>

            {isExpanded && (
               loading ? renderLoadingSkeleton() : (
                  data?.statistics && (
                     <div className="flex flex-col gap-4">
                        {data.statistics.map((stat, index) => {
                           const statisticsTypeLabel =
                              Object.keys(StatisticsType).find(
                                 (key) => StatisticsType[key] === stat.type
                              ) || "-";

                           const { labelEmoji, callsEmoji } = getEmojisByType(
                              stat.type
                           );

                           return (
                              <div key={index} className="border-t pt-3">
                                 <p className="font-semibold mt-2 text-center bg-gray-100 py-2 rounded-lg">
                                    {labelEmoji} {statisticsTypeLabel} {labelEmoji}
                                 </p>
                                 <div className="divide-y">
                                    {stat.users?.map((user, i) => (
                                       <div
                                          key={i}
                                          className="py-3 text-sm text-gray-700"
                                       >
                                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                                             <div className="font-medium">{user.name}</div>
                                             <div className="text-gray-500 text-xs md:text-sm">
                                                <a className="hover:text-blue-600" href={`mailto:${user?.email}`}>
                                                   {user?.email}
                                                </a>
                                                {user?.jobRole && (
                                                   <span> - {user?.jobRole}</span>
                                                )}
                                             </div>
                                          </div>
                                          <div className="mt-2 bg-gray-50 p-2 rounded text-blue-700">
                                             {[1, 2].includes(stat.type) && (
                                                <p>
                                                   {callsEmoji} Total Duration:{" "}
                                                   <span className="font-semibold">{Math.floor(user?.totalDuration / 60)}m {user?.totalDuration % 60}s</span>
                                                </p>
                                             )}
                                             {[3, 4].includes(stat.type) && (
                                                <p>
                                                   {callsEmoji} Total Calls:{" "}
                                                   <span className="font-semibold">{user?.totalCalls}</span>
                                                </p>
                                             )}
                                             {[5, 6].includes(stat.type) && (
                                                <p>
                                                   {callsEmoji} Avg. Cold Call Score:{" "}
                                                   <span className="font-semibold">{user?.avgSalesRepScore ?? "N/A"}</span>
                                                </p>
                                             )}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )
               )
            )}
            <div className="flex justify-center mt-2">
               <button
                  onClick={handleToggleClick}
                  className="px-8 py-2 rounded-3xl flex items-center border border-gray-300 justify-center hover:bg-gray-100"
               >
                  {isExpanded ? "Hide" : "Statistics"}
               </button>
            </div>
         </div>
      </div>
   );
};

export default StatisticCard;
