import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PeriodType } from "../static/enums/PeriodType";
import { getAllAgents } from "../api/agentApi";

const FiltersComponent = ({ selectedTab, setFilters }) => {
   const [startDate, setStartDate] = useState("");
   const [selectedPeriod, setSelectedPeriod] = useState("");
   const [agents, setAgents] = useState([]);
   const [selectedAgentId, setSelectedAgentId] = useState("");
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredAgents, setFilteredAgents] = useState([]);

   useEffect(() => {
      const fetchAgents = async () => {
         try {
            const res = await getAllAgents();
            if (res.statusCode === 200 && res.data) {
               setAgents(res.data);
               setFilteredAgents(res.data);
            }
         } catch (error) {
            console.error("Error fetching agents:", error);
         }
      };
      if (selectedTab === 1) {
         fetchAgents();
      }
      setSelectedAgentId("");
      setSelectedPeriod("");
      setStartDate("");
      setSearchTerm("");
      setFilters([]);
   }, [selectedTab]);

   useEffect(() => {
      if (searchTerm.trim() === "") {
         setFilteredAgents(agents);
      } else {
         const filtered = agents.filter(agent => 
            agent.name.toLowerCase().includes(searchTerm.toLowerCase())
         );
         setFilteredAgents(filtered);
      }
   }, [searchTerm, agents]);

   const onFilterChange = (newFilters) => {
      const filters = [];

      if (newFilters.agentId) {
         filters.push({ name: "agent.id", value: newFilters.agentId });
      }
      if (newFilters.startDate) {
         filters.push({
            name: "datetimeInserted",
            value: newFilters.startDate,
         });
      }
      if (newFilters.period) {
         filters.push({ name: "type", value: newFilters.period });
      }

      setFilters(filters);
   };

   const handleSelectAgent = (id) => {
      setSelectedAgentId(id);
      setIsDropdownOpen(false);
      setSearchTerm("");
      onFilterChange({ agentId: id, startDate, period: selectedPeriod });
   };

   const handleSelectPeriod = (period) => {
      setSelectedPeriod(period);
      setIsDropdownOpen(false);
      onFilterChange({ agentId: selectedAgentId, startDate, period });
   };

   const selectedAgentName = selectedAgentId
      ? agents.find((agent) => agent.id === selectedAgentId)?.name
      : "";

   const selectedPeriodName = selectedPeriod
      ? Object.entries(PeriodType).find(
           ([label, value]) => value === selectedPeriod
        )?.[0]
      : "";

   const handleAgentSearch = (e) => {
      setSearchTerm(e.target.value);
   };

   return (
      <div className="flex gap-4 w-1/3">
         <div className="w-full">
            <DatePicker
               selected={startDate}
               onChange={(date) => {
                  const year = date.getFullYear();
                  const month = (date.getMonth() + 1)
                     .toString()
                     .padStart(2, "0"); 
                  const day = date.getDate().toString().padStart(2, "0");
                  const localDate = `${year}-${month}-${day}`;
                  setStartDate(localDate);
                  onFilterChange({
                     agentId: selectedAgentId,
                     startDate: localDate,
                     period: selectedPeriod,
                  });
               }}
               placeholderText="Select Date"
               className="w-full py-2 px-4 text-center rounded-2xl bg-blue-100 hover:bg-gray-200 outline-none cursor-pointer"
            />
         </div>

         {selectedTab === 1 ? (
            <div className="relative w-full">
               <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="max-w-[170px] w-full py-2 px-4 text-center rounded-2xl overflow-hidden bg-blue-100 hover:bg-gray-200 text-gray-400 outline-none whitespace-nowrap text-ellipsis"
               >
                  {selectedAgentId ? `${selectedAgentName}` : "Select Agent"}
               </button>
               {isDropdownOpen && (
                  <div className="absolute w-full bg-white border rounded-2xl shadow-md" style={{ zIndex: 1000 }}>
                     <div className="p-2">
                        <input
                           type="text"
                           value={searchTerm}
                           onChange={handleAgentSearch}
                           placeholder="Search agent..."
                           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                           autoFocus
                        />
                     </div>
                     <ul className="max-h-48 overflow-y-auto">
                        {filteredAgents.map((agent) => (
                           <li
                              key={agent.id}
                              onClick={() => handleSelectAgent(agent.id)}
                              className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                           >
                              {agent.name}
                           </li>
                        ))}
                        {filteredAgents.length === 0 && (
                           <li className="py-2 px-4 text-gray-500 italic">
                              No agents found
                           </li>
                        )}
                     </ul>
                  </div>
               )}
            </div>
         ) : (
            <div className="relative w-full">
               <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full py-2 px-4 text-center rounded-2xl bg-blue-100 hover:bg-gray-200 text-gray-400 outline-none"
               >
                  {selectedPeriod ? `${selectedPeriodName}` : "Select Period"}
               </button>
               {isDropdownOpen && (
                  <ul
                     className="absolute w-full max-h-48 overflow-y-auto bg-white border rounded-2xl shadow-md"
                     style={{ zIndex: 1000 }}
                  >
                     <li
                        onClick={() => handleSelectPeriod("")}
                        className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                     >
                        Select Period
                     </li>
                     {Object.entries(PeriodType).map(([label, value]) => (
                        <li
                           key={value}
                           onClick={() => handleSelectPeriod(value)}
                           className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                        >
                           {label}
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         )}
         <button
            onClick={() => {
               setStartDate(null);
               setSelectedAgentId("");
               setSelectedPeriod("");
               setSearchTerm("");
               setFilters([]);
            }}
            className="text-black rounded-2xl"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="currentColor"
               className="w-6 h-6"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
               />
            </svg>
         </button>
      </div>
   );
};

export default FiltersComponent;
