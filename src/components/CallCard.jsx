// CallCard.jsx
import React, { useState } from "react";
import { formatDate } from "../utils/formatDate";
import ReactMarkdown from "react-markdown";

const CallCard = ({ call }) => {
   const [showMore, setShowMore] = useState(false);

   const timeDistributionsByType =
      call?.timeDistributions?.reduce((acc, dist) => {
         acc[dist.type] = dist.value;
         return acc;
      }, {}) ?? {};

   return (
      <div
         className="border rounded-lg p-3 flex flex-col w-full shadow-lg bg-white"
         style={{ minHeight: "200px" }}
      >
         <div className="p-2 flex flex-col gap-4 w-full">
            <div className="text-gray-600 text-lg font-semibold">
               <p>{formatDate(call.datetimeInserted)}</p>
            </div>

            <div className="flex gap-8">
               <div className="flex flex-col gap-2 flex-[2]">
                  <p className="text-sm text-gray-700 font-bold">👥 From:</p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Name:</span>{" "}
                     {call?.agent?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Phone:</span>{" "}
                     <a className="hover:text-blue-600" href={`tel:${call?.agent?.phone}`}>
                        {call?.agent?.phone}
                     </a>
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Email:</span>{" "}
                     <a className="hover:text-blue-600" href={`mailto:${call?.agent?.email}`}>
                        {call.agent?.email}
                     </a>
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Job Role:</span>{" "}
                     {call?.agent?.jobRole}
                  </p>
               </div>
               <div className="flex flex-col gap-2 flex-[2]">
                  <p className="text-sm text-gray-700 font-bold">👥 To:</p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Name:</span>{" "}
                     {call?.customer?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Phone:</span>{" "}
                     <a className="hover:text-blue-600" href={`tel:${call.customer?.phone}`}>
                        {call?.customer?.phone}
                     </a>
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Email:</span>{" "}
                     <a className="hover:text-blue-600" href={`mailto:${call.customer?.email}`}>
                        {call?.customer?.email}
                     </a>
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Company:</span>{" "}
                     {call?.customer?.company}
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Website:</span>{" "}
                     <a
                        href={call.customer?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                     >
                        {call?.customer?.website}
                     </a>
                  </p>
               </div>
               <div className="flex flex-col items-center justify-center flex-[1] gap-y-5 text-blue-600">
                  <span className="font-semibold">Recording: </span>
                  <a
                     href={call?.recordingUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-16 h-16 p-4 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                        />
                     </svg>
                  </a>

                  <p className="text-gray-500">
                     <span className="text-lg font-semibold">Duration: </span>
                     {Math.floor(call?.duration / 60)}m {call?.duration % 60}s
                  </p>
               </div>
            </div>
         </div>
         {showMore && (
            <div className="p-3 border-t mt-5 flex flex-col text-center gap-3 text-sm text-gray-600">
               <p className="text-sm text-gray-700 font-bold mt-5">
               📊 Talk Time Distribution
               </p>
               <div className="flex justify-between gap-4">
                  <p className="flex-1 text-sm text-gray-500">
                     <span className="font-semibold">Agent:</span>{" "}
                     {timeDistributionsByType[1] != null
                        ? `${timeDistributionsByType[1]}%`
                        : "-"}
                  </p>
                  <p className="flex-1 text-sm text-gray-500">
                     <span className="font-semibold">Customer:</span>{" "}
                     {timeDistributionsByType[2] != null
                        ? `${timeDistributionsByType[2]}%`
                        : "-"}
                  </p>
                  <p className="flex-1 text-sm text-gray-500">
                     <span className="font-semibold">Other:</span>{" "}
                     {timeDistributionsByType[3] != null
                        ? `${timeDistributionsByType[3]}%`
                        : "-"}
                  </p>
               </div>

               <p className="text-sm text-gray-700 font-bold mt-3">Sentiment</p>
               <div className="flex justify-between gap-4">
                  <p className="flex-1 text-sm text-gray-500">
                     <span className="font-semibold">Positive:</span>{" "}
                     {call?.sentiment?.Positive}%
                  </p>
                  <p className="flex-1 text-sm text-gray-500">
                     <span className="font-semibold">Neutral:</span>{" "}
                     {call?.sentiment?.Neutral}%
                  </p>
                  <p className="flex-1 text-sm text-gray-500">
                     <span className="font-semibold">Negative:</span>{" "}
                     {call?.sentiment?.Negative}%
                  </p>
               </div>

               <p className="text-sm text-gray-700 font-bold mt-3">Summary</p>
               <div className="text-start">{call?.summary}</div>

               <p className="text-sm text-gray-700 font-bold">Suggestions</p>
               <div className="text-start">
                  <ReactMarkdown>{call?.suggestions}</ReactMarkdown>
               </div>
            </div>
         )}

         <div className="flex justify-center mt-6">
            <button
               onClick={() => setShowMore(!showMore)}
               className="px-8 py-2 rounded-3xl flex items-center border border-gray-300 justify-center hover:bg-gray-100"
            >
               {showMore ? "Hide" : "AI Analysis"}
            </button>
         </div>
      </div>
   );
};

export default CallCard;
