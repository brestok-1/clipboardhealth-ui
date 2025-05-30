// CallCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import ReactMarkdown from "react-markdown";
import { AiOutlinePhone } from 'react-icons/ai';


const CallCard = ({ call, isExpanded, onToggleExpand }) => {
   const navigate = useNavigate();
   
   const timeDistributionsByType =
      call?.timeDistributions?.reduce((acc, dist) => {
         acc[dist.type] = dist.value;
         return acc;
      }, {}) ?? {};

   const handleViewDetails = () => {
      navigate(`/call/${call.id}`);
   };

   return (
      <div
         className="border rounded-lg p-3 flex flex-col w-full shadow-lg bg-white"
         style={{ minHeight: "200px" }}
      >
         <div className="p-2 flex flex-col gap-4 w-full">
            <div className="text-gray-600 text-lg font-semibold">
               <p>{formatDate(call.datetimeInserted)}</p>
            </div>

            {/* Desktop layout */}
            <div className="hidden md:flex gap-8">
               <div className="flex flex-col gap-2 flex-[2]">
                  <p className="text-sm text-gray-700 font-bold">👥 From:</p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Name:</span>{" "}
                     {call?.user?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Phone:</span>{" "}
                     <a
                        className="hover:text-blue-600"
                        href={`tel:${call?.user?.phone}`}
                     >
                        {call?.user?.phone}
                     </a>
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Email:</span>{" "}
                     <a
                        className="hover:text-blue-600"
                        href={`mailto:${call?.user?.account?.email}`}
                     >
                        {call?.user?.account?.email}
                     </a>
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Job Role:</span>{" "}
                     {call?.user?.jobRole}
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
                     <a
                        className="hover:text-blue-600"
                        href={`tel:${call.customer?.phone}`}
                     >
                        {call?.customer?.phone}
                     </a>
                  </p>
                  <p className="text-sm text-gray-500">
                     <span className="font-semibold">Email:</span>{" "}
                     <a
                        className="hover:text-blue-600"
                        href={`mailto:${call.customer?.email}`}
                     >
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
                     className="w-16 h-16 p-4 rounded-full bg-blue-500 rotate-90 text-white flex items-center justify-center hover:bg-blue-600"
                  >
                    <AiOutlinePhone size={40} />
                  </a>

                  <p className="text-gray-500">
                     <span className="text-lg font-semibold">Duration: </span>
                     {Math.floor(call?.duration / 60)}m {call?.duration % 60}s
                  </p>
               </div>
            </div>

            {/* Mobile layout */}
            <div className="flex flex-col md:hidden gap-4">
               {/* User info (From) */}
               <div className="border-b pb-3">
                  <p className="text-sm text-gray-700 font-bold mb-2">👥 From:</p>
                  <div className="grid grid-cols-1 gap-1">
                     <p className="text-sm text-gray-500">
                        <span className="font-semibold">Name:</span>{" "}
                        {call?.user?.name || "N/A"}
                     </p>
                     <p className="text-sm text-gray-500">
                        <span className="font-semibold">Phone:</span>{" "}
                        <a className="hover:text-blue-600" href={`tel:${call?.user?.phone}`}>
                           {call?.user?.phone}
                        </a>
                     </p>
                     <p className="text-sm text-gray-500">
                        <span className="font-semibold">Email:</span>{" "}
                        <a className="hover:text-blue-600" href={`mailto:${call?.user?.account?.email}`}>
                           {call?.user?.account?.email}
                        </a>
                     </p>
                     <p className="text-sm text-gray-500">
                        <span className="font-semibold">Job Role:</span>{" "}
                        {call?.user?.jobRole}
                     </p>
                  </div>
               </div>
               
               {/* Customer info (To) */}
               <div className="border-b pb-3">
                  <p className="text-sm text-gray-700 font-bold mb-2">👥 To:</p>
                  <div className="grid grid-cols-1 gap-1">
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
               </div>
               
               {/* Recording & Duration */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <a
                        href={call?.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 p-3 rounded-full bg-blue-500 rotate-90 text-white flex items-center justify-center hover:bg-blue-600"
                     >
                       <AiOutlinePhone size={24} />
                     </a>
                     <span className="text-blue-600 font-semibold">Recording</span>
                  </div>
                  <p className="text-gray-500">
                     <span className="font-semibold">Duration: </span>
                     {Math.floor(call?.duration / 60)}m {call?.duration % 60}s
                  </p>
               </div>
            </div>
         </div>
         {isExpanded && (
            <div className="p-3 border-t mt-5 flex flex-col text-center gap-3 text-sm text-gray-600">
               <p className="text-sm text-gray-700 font-bold mt-5">
                  📊 Talk Time Distribution
               </p>
               <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
                  <p className="flex-1 text-sm text-gray-500 min-w-[100px]">
                     <span className="font-semibold">User:</span>{" "}
                     {timeDistributionsByType[1] != null
                        ? `${timeDistributionsByType[1]}%`
                        : "-"}
                  </p>
                  <p className="flex-1 text-sm text-gray-500 min-w-[100px]">
                     <span className="font-semibold">Customer:</span>{" "}
                     {timeDistributionsByType[2] != null
                        ? `${timeDistributionsByType[2]}%`
                        : "-"}
                  </p>
                  <p className="flex-1 text-sm text-gray-500 min-w-[100px]">
                     <span className="font-semibold">Other:</span>{" "}
                     {timeDistributionsByType[3] != null
                        ? `${timeDistributionsByType[3]}%`
                        : "-"}
                  </p>
               </div>

               <p className="text-sm text-gray-700 font-bold mt-3">🙂 Sentiment</p>
               <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
                  <p className="flex-1 text-sm text-gray-500 min-w-[100px]">
                     <span className="font-semibold">Positive:</span>{" "}
                     {call?.sentiment?.Positive}%
                  </p>
                  <p className="flex-1 text-sm text-gray-500 min-w-[100px]">
                     <span className="font-semibold">Neutral:</span>{" "}
                     {call?.sentiment?.Neutral}%
                  </p>
                  <p className="flex-1 text-sm text-gray-500 min-w-[100px]">
                     <span className="font-semibold">Negative:</span>{" "}
                     {call?.sentiment?.Negative}%
                  </p>
               </div>

               <p className="text-sm text-gray-700 font-bold mt-3">📝 Summary</p>
               <div className="text-start">{call?.summary}</div>

               <p className="text-sm text-gray-700 font-bold">📈 Suggestions</p>
               <div className="text-start">
                  <ReactMarkdown>{call?.suggestions}</ReactMarkdown>
               </div>
            </div>
         )}

         <div className="flex justify-center mt-6 gap-3">
            <button
               onClick={onToggleExpand}
               className="px-6 py-2 rounded-3xl flex items-center border border-gray-300 justify-center hover:bg-gray-100"
            >
               {isExpanded ? "Hide" : "AI Analysis"}
            </button>
            <button
               onClick={handleViewDetails}
               className="px-6 py-2 rounded-3xl flex items-center bg-blue-500 text-white justify-center hover:bg-blue-600 transition-colors"
            >
               View Details
            </button>
         </div>
      </div>
   );
};

export default CallCard;
