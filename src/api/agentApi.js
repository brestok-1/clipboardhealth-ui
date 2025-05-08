import apiRequest from "../utils/apiRequest";


export const getAllCalls = async (pageSize, pageIndex) => {
   const { data, statusCode } = await apiRequest({
      method: "get",
      url: "/api/call/all",
      params: {
         pageSize,
         pageIndex,
      },
   });

   if (statusCode !== 200) {
      console.error("Error fetching data:", statusCode);
      return { data: null, statusCode };
   }

   return { data, statusCode };
};

export const getAllStatistics = async (pageSize, pageIndex) => {
    const { data, statusCode } = await apiRequest({
       method: "get",
       url: "/api/callstatistics/all",
       params: {
          pageSize,
          pageIndex,
       },
    });
 
    if (statusCode !== 200) {
       console.error("Error fetching data:", statusCode);
       return { data: null, statusCode };
    }
 
    return { data, statusCode };
 };
 
 export const getStatisticById = async (statisticsId) => {
   const { data, statusCode } = await apiRequest({
      method: "get",
      url: `/api/callstatistics/${statisticsId}`,
   });
   if (statusCode !== 200) {
      console.error("Error fetching data:", statusCode);
      return { data: null };
   }

   return { data };
};

export const getAllAgents = async () => {
   const { data, statusCode } = await apiRequest({
      method: "get",
      url: "/api/callstatistics/agents",
   });

   if (statusCode !== 200) {
      console.error("Error fetching data:", statusCode);
      return { data: null};
   }

   return { data, statusCode };
};

export const filterCalls = async (filters, pageSize, pageIndex) => {
   const data = {
     filter: filters,
     pageSize: pageSize,
     pageIndex: pageIndex,
   };
 
   const response = await apiRequest({
     method: 'POST',
     url: '/api/call/search', 
     data: data, 
   });
 
   return response;
 };

 export const filterStatistics = async (filters, pageSize, pageIndex) => {
   const data = {
     filter: filters,
     pageSize: pageSize,
     pageIndex: pageIndex,
   };
 
   const response = await apiRequest({
     method: 'POST',
     url: '/api/callstatistics/search', 
     data: data, 
   });
 
   return response;
 };

