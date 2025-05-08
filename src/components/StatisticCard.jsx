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
   }, [isExpanded, data, statistic.id]);

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

   return (
      <div
         className="border rounded-lg p-3 flex flex-col w-full shadow-lg bg-white"
         style={{ minHeight: "150px" }}
      >
         <div className="p-2 flex flex-col gap-4 w-full">
            <div className="text-gray-600 text-lg font-semibold">
               <p>{formatDate(statistic.datetimeInserted)}</p>
            </div>
            <p>
               Type: <strong>{periodLabel}</strong>
            </p>

            {isExpanded && data?.statistics && (
               <div className="flex flex-col gap-2">
                  {data.statistics.map((stat, index) => {
                     const statisticsTypeLabel =
                        Object.keys(StatisticsType).find(
                           (key) => StatisticsType[key] === stat.type
                        ) || "-";

                     const { labelEmoji, callsEmoji } = getEmojisByType(
                        stat.type
                     );

                     return (
                        <div key={index}>
                           <p className="font-semibold mt-2">
                              {labelEmoji} {statisticsTypeLabel} {labelEmoji}
                           </p>
                           {stat.users?.map((user, i) => (
                              <div
                                 key={i}
                                 className="pl-2 mt-4 text-sm text-gray-700"
                              >
                                 {user.name} (
                                 <a className="hover:text-blue-600" href={`mailto:${user?.email}`}>
                                    {user?.email}
                                 </a>
                                 ) - {user?.jobRole}
                                 {[1, 2].includes(stat.type) && (
                                    <p>
                                       {callsEmoji} Total Duration:{" "}
                                       {Math.floor(user?.totalDuration / 60)}m {user?.totalDuration % 60}s
                                    </p>
                                 )}
                                 {[3, 4].includes(stat.type) && (
                                    <p>
                                       {callsEmoji} Total Calls:{" "}
                                       {user?.totalCalls}
                                    </p>
                                 )}
                                 {[5, 6].includes(stat.type) && (
                                    <p>
                                       {callsEmoji} Avg. Cold Call Score:{" "}
                                       {user?.avgSalesRepScore ?? "N/A"}
                                    </p>
                                 )}
                              </div>
                           ))}
                        </div>
                     );
                  })}
               </div>
            )}
            <div className="flex justify-center">
               <button
                  onClick={onToggleExpand}
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
