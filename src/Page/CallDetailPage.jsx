import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCallById } from "../api/agentApi";
import { formatDate } from "../utils/formatDate";
import ReactMarkdown from "react-markdown";
import { AiOutlinePhone, AiOutlineArrowLeft } from 'react-icons/ai';
import HeaderComponent from "../components/HeaderComponent";

const CallDetailPage = () => {
   const { callId } = useParams();
   const navigate = useNavigate();
   const [call, setCall] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchCall = async () => {
         setIsLoading(true);
         setError(null);
         
         try {
            const response = await getCallById(callId);
            if (response.statusCode === 200) {
               setCall(response.data);
            } else {
               setError("Failed to load call details");
            }
         } catch (err) {
            setError("An error occurred while loading call details");
            console.error("Error fetching call:", err);
         } finally {
            setIsLoading(false);
         }
      };

      if (callId) {
         fetchCall();
      }
   }, [callId]);

   const timeDistributionsByType = call?.timeDistributions?.reduce((acc, dist) => {
      acc[dist.type] = dist.value;
      return acc;
   }, {}) ?? {};

   if (isLoading) {
      return (
         <div className="w-screen h-screen flex bg-gray-100 flex-col overflow-hidden">
            <HeaderComponent />
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading call details...</p>
               </div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="w-screen h-screen flex bg-gray-100 flex-col overflow-hidden">
            <HeaderComponent />
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <p className="text-red-600 text-xl mb-4">{error}</p>
                  <button
                     onClick={() => navigate(-1)}
                     className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                     Go Back
                  </button>
               </div>
            </div>
         </div>
      );
   }

   if (!call) {
      return (
         <div className="w-screen h-screen flex bg-gray-100 flex-col overflow-hidden">
            <HeaderComponent />
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <p className="text-gray-600 text-xl">Call not found</p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-screen h-screen flex bg-gray-100 flex-col overflow-hidden">
         <HeaderComponent />
         
         <div className="flex-1 overflow-auto p-3 md:p-6">
            <div className="max-w-6xl mx-auto">
               {/* Back Button */}
               <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
               >
                  <AiOutlineArrowLeft size={20} />
                  <span>Back to Calls</span>
               </button>

               {/* Main Call Details Card */}
               <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
                  {/* Header */}
                  <div className="mb-6 pb-4 border-b border-gray-200">
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Call Details
                     </h1>
                     <p className="text-lg text-gray-600">
                        {formatDate(call.datetimeInserted)}
                     </p>
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                     {/* From (User) Information */}
                     <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                           👥 From
                        </h2>
                        <div className="space-y-3">
                           <div>
                              <span className="font-semibold text-gray-700">Name:</span>
                              <p className="text-gray-600">{call?.user?.name || "N/A"}</p>
                           </div>
                           <div>
                              <span className="font-semibold text-gray-700">Phone:</span>
                              <p className="text-gray-600">
                                 <a
                                    className="hover:text-blue-600 transition-colors"
                                    href={`tel:${call?.user?.phone}`}
                                 >
                                    {call?.user?.phone}
                                 </a>
                              </p>
                           </div>
                           <div>
                              <span className="font-semibold text-gray-700">Email:</span>
                              <p className="text-gray-600">
                                 <a
                                    className="hover:text-blue-600 transition-colors"
                                    href={`mailto:${call?.user?.account?.email}`}
                                 >
                                    {call?.user?.account?.email}
                                 </a>
                              </p>
                           </div>
                           <div>
                              <span className="font-semibold text-gray-700">Job Role:</span>
                              <p className="text-gray-600">{call?.user?.jobRole}</p>
                           </div>
                        </div>
                     </div>

                     {/* To (Customer) Information */}
                     <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                           👥 To
                        </h2>
                        <div className="space-y-3">
                           <div>
                              <span className="font-semibold text-gray-700">Name:</span>
                              <p className="text-gray-600">{call?.customer?.name}</p>
                           </div>
                           <div>
                              <span className="font-semibold text-gray-700">Phone:</span>
                              <p className="text-gray-600">
                                 <a
                                    className="hover:text-blue-600 transition-colors"
                                    href={`tel:${call.customer?.phone}`}
                                 >
                                    {call?.customer?.phone}
                                 </a>
                              </p>
                           </div>
                           <div>
                              <span className="font-semibold text-gray-700">Email:</span>
                              <p className="text-gray-600">
                                 <a
                                    className="hover:text-blue-600 transition-colors"
                                    href={`mailto:${call.customer?.email}`}
                                 >
                                    {call?.customer?.email}
                                 </a>
                              </p>
                           </div>
                           <div>
                              <span className="font-semibold text-gray-700">Company:</span>
                              <p className="text-gray-600">{call?.customer?.company}</p>
                           </div>
                           <div>
                              <span className="font-semibold text-gray-700">Website:</span>
                              <p className="text-gray-600">
                                 <a
                                    href={call.customer?.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 transition-colors"
                                 >
                                    {call?.customer?.website}
                                 </a>
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Recording & Duration */}
                     <div className="bg-blue-50 rounded-lg p-4 md:p-6 flex flex-col items-center justify-center text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recording</h2>
                        <a
                           href={call?.recordingUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-20 h-20 p-5 rounded-full bg-blue-500 rotate-90 text-white flex items-center justify-center hover:bg-blue-600 transition-colors mb-4"
                        >
                           <AiOutlinePhone size={40} />
                        </a>
                        <div className="space-y-2">
                           <p className="text-gray-600">
                              <span className="font-semibold">Duration:</span>
                           </p>
                           <p className="text-2xl font-bold text-blue-600">
                              {Math.floor(call?.duration / 60)}m {call?.duration % 60}s
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Analytics Section */}
                  <div className="space-y-6">
                     {/* Talk Time Distribution */}
                     <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                           📊 Talk Time Distribution
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="text-center p-4 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-blue-600">
                                 {timeDistributionsByType[1] != null ? `${timeDistributionsByType[1]}%` : "-"}
                              </p>
                              <p className="text-gray-600 font-semibold">User</p>
                           </div>
                           <div className="text-center p-4 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-green-600">
                                 {timeDistributionsByType[2] != null ? `${timeDistributionsByType[2]}%` : "-"}
                              </p>
                              <p className="text-gray-600 font-semibold">Customer</p>
                           </div>
                           <div className="text-center p-4 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-gray-600">
                                 {timeDistributionsByType[3] != null ? `${timeDistributionsByType[3]}%` : "-"}
                              </p>
                              <p className="text-gray-600 font-semibold">Other</p>
                           </div>
                        </div>
                     </div>

                     {/* Sentiment Analysis */}
                     <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                           🙂 Sentiment Analysis
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="text-center p-4 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-green-600">
                                 {call?.sentiment?.Positive || 0}%
                              </p>
                              <p className="text-gray-600 font-semibold">Positive</p>
                           </div>
                           <div className="text-center p-4 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-yellow-600">
                                 {call?.sentiment?.Neutral || 0}%
                              </p>
                              <p className="text-gray-600 font-semibold">Neutral</p>
                           </div>
                           <div className="text-center p-4 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-red-600">
                                 {call?.sentiment?.Negative || 0}%
                              </p>
                              <p className="text-gray-600 font-semibold">Negative</p>
                           </div>
                        </div>
                     </div>

                     {/* Summary */}
                     <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                           📝 Summary
                        </h2>
                        <div className="prose prose-sm max-w-none">
                           <p className="text-gray-700 leading-relaxed">
                              {call?.summary || "No summary available for this call."}
                           </p>
                        </div>
                     </div>

                     {/* AI Suggestions */}
                     <div className="bg-blue-50 rounded-lg p-4 md:p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                           📈 AI Suggestions
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-700">
                           {call?.suggestions ? (
                              <ReactMarkdown>{call.suggestions}</ReactMarkdown>
                           ) : (
                              <p>No suggestions available for this call.</p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CallDetailPage; 