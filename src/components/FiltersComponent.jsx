import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PeriodType } from "../static/enums/PeriodType";
import { getAllAgents } from "../api/agentApi";

const FiltersComponent = ({ selectedTab, setFilters }) => {
   const [startDate, setStartDate] = useState("");
   const [selectedPeriod, setSelectedPeriod] = useState("");
   const [users, setUsers] = useState([]);
   const [selectedUserId, setSelectedUserId] = useState("");
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredUsers, setFilteredUsers] = useState([]);
   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const res = await getAllAgents();
            if (res.statusCode === 200 && res.data) {
               setUsers(res.data);
               setFilteredUsers(res.data);
            }
         } catch (error) {
            console.error("Error fetching users:", error);
         }
      };
      if (selectedTab === 1) {
         fetchUsers();
      }
      setSelectedUserId("");
      setSelectedPeriod("");
      setStartDate("");
      setSearchTerm("");
      setFilters([]);
   }, [selectedTab, setFilters]);

   useEffect(() => {
      if (searchTerm.trim() === "") {
         setFilteredUsers(users);
      } else {
         const filtered = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
         );
         setFilteredUsers(filtered);
      }
   }, [searchTerm, users]);

   const onFilterChange = (newFilters) => {
      const filters = [];

      if (newFilters.userId) {
         filters.push({ name: "user.id", value: newFilters.userId });
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

   const handleSelectUser = (id) => {
      setSelectedUserId(id);
      setIsDropdownOpen(false);
      setSearchTerm("");
      onFilterChange({ userId: id, startDate, period: selectedPeriod });
   };

   const handlePeriodChange = (period) => {
      setSelectedPeriod(period);
      setIsDropdownOpen(false);
      onFilterChange({ userId: selectedUserId, startDate, period });
   };

   const selectedUserName = selectedUserId
      ? users.find((user) => user.id === selectedUserId)?.name
      : "";

   const selectedPeriodName = selectedPeriod
      ? Object.entries(PeriodType).find(
           ([label, value]) => value === selectedPeriod
        )?.[0]
      : "";

   const handleUserSearch = (e) => {
      setSearchTerm(e.target.value);
   };

   const handleClearFilters = () => {
      setStartDate("");
      setSelectedUserId("");
      setSelectedPeriod("");
      setSearchTerm("");
      setFilters([]);
      setIsMobileFilterOpen(false);
   };

   const hasActiveFilters = startDate || selectedUserId || selectedPeriod;

   // Рендер десктопной версии фильтров
   const renderDesktopFilters = () => (
      <div className="hidden md:flex gap-4 w-full justify-end">
         <div className="w-auto">
            <DatePicker
               selected={startDate ? new Date(startDate) : null}
               onChange={(date) => {
                  if (date) {
                     // Create a date object in UTC
                     const utcDate = new Date(Date.UTC(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        0, 0, 0
                     ));

                     // Format as ISO string and extract the date part (YYYY-MM-DD)
                     const isoDate = utcDate.toISOString().split('T')[0];
                     setStartDate(isoDate); // Keep original state for display if needed

                     const offsetMinutes = date.getTimezoneOffset(); 
                     const offsetHours = - (offsetMinutes / 60);
                     const timezoneOffsetString = offsetHours > 0 ? `+${offsetHours}` : `${offsetHours}`;

                     onFilterChange({
                        userId: selectedUserId,
                        startDate: `${isoDate};${timezoneOffsetString}`,
                        period: selectedPeriod,
                     });
                  } else {
                     setStartDate("");
                     onFilterChange({
                        userId: selectedUserId,
                        startDate: "",
                        period: selectedPeriod,
                     });
                  }
               }}
               placeholderText="Select Date"
               className="w-full py-2 px-4 text-center rounded-2xl bg-blue-100 hover:bg-gray-200 outline-none cursor-pointer"
               isClearable
            />
         </div>

         {selectedTab === 1 ? (
            <div className="relative w-auto">
               <div className="relative">
                  <button
                     className="w-full px-4 py-2 text-left border rounded-md hover:bg-gray-50"
                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                     {selectedUserId ? `${selectedUserName}` : "Select User"}
                  </button>
                  {isDropdownOpen && (
                     <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                        <input
                           type="text"
                           className="w-full px-4 py-2 border-b"
                           value={searchTerm}
                           onChange={handleUserSearch}
                           placeholder="Search user..."
                        />
                        <div className="max-h-60 overflow-auto">
                           {filteredUsers.map((user) => (
                              <div
                                 key={user.id}
                                 onClick={() => handleSelectUser(user.id)}
                                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                 {user.name}
                              </div>
                           ))}
                           {filteredUsers.length === 0 && (
                              <div className="px-4 py-2 text-gray-500">
                                 No users found
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         ) : (
            <div className="relative w-auto">
               <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full py-2 px-4 text-center rounded-2xl bg-blue-100 hover:bg-gray-200 text-gray-600 outline-none"
               >
                  {selectedPeriod ? `${selectedPeriodName}` : "Select Period"}
               </button>
               {isDropdownOpen && (
                  <ul
                     className="absolute right-0 w-48 max-h-48 overflow-y-auto bg-white border rounded-2xl shadow-md"
                     style={{ zIndex: 1000 }}
                  >
                     {Object.entries(PeriodType).map(([label, value]) => (
                        <li
                           key={value}
                           onClick={() => handlePeriodChange(value)}
                           className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                        >
                           {label}
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         )}
         {hasActiveFilters && (
            <button
               onClick={handleClearFilters}
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
         )}
      </div>
   );

   // Рендер мобильной версии фильтров
   const renderMobileFilters = () => (
      <div className="md:hidden w-full">
         <div className="flex justify-between items-center">
            <button 
               onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
               className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
               </svg>
               <span>Filter</span>
               {hasActiveFilters && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                     !
                  </span>
               )}
            </button>
            
            {hasActiveFilters && (
               <button
                  onClick={handleClearFilters}
                  className="text-sm text-red-500 underline"
               >
                  Clear all
               </button>
            )}
         </div>
         
         {isMobileFilterOpen && (
            <div className="mt-3 p-4 bg-white rounded-lg shadow-md">
               <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Date
                  </label>
                  <DatePicker
                     selected={startDate ? new Date(startDate) : null}
                     onChange={(date) => {
                        if (date) {
                           // Create a date object in UTC
                           const utcDate = new Date(Date.UTC(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                              0, 0, 0
                           ));

                           // Format as ISO string and extract the date part (YYYY-MM-DD)
                           const isoDate = utcDate.toISOString().split('T')[0];
                           setStartDate(isoDate); // Keep original state for display if needed

                           const offsetMinutes = date.getTimezoneOffset();
                           const offsetHours = - (offsetMinutes / 60);
                           const timezoneOffsetString = offsetHours > 0 ? `+${offsetHours}` : `${offsetHours}`;

                           onFilterChange({
                              userId: selectedUserId,
                              startDate: `${isoDate};${timezoneOffsetString}`,
                              period: selectedPeriod,
                           });
                        } else {
                           setStartDate("");
                           onFilterChange({
                              userId: selectedUserId,
                              startDate: "",
                              period: selectedPeriod,
                           });
                        }
                     }}
                     placeholderText="Select Date"
                     className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none cursor-pointer"
                     isClearable
                  />
               </div>
               
               {selectedTab === 1 ? (
                  <div className="mb-4">
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        User
                     </label>
                     <div className="relative">
                        <button
                           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                           className="w-full py-2 px-4 text-left border border-gray-300 rounded-lg"
                        >
                           {selectedUserId ? selectedUserName : "Select User"}
                        </button>
                        {isDropdownOpen && (
                           <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-md z-10">
                              <div className="p-2">
                                 <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleUserSearch}
                                    placeholder="Search user..."
                                    className="w-full p-2 border rounded-lg"
                                    autoFocus
                                 />
                              </div>
                              <div className="max-h-60 overflow-auto">
                                 {filteredUsers.map((user) => (
                                    <div
                                       key={user.id}
                                       onClick={() => handleSelectUser(user.id)}
                                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                       {user.name}
                                    </div>
                                 ))}
                                 {filteredUsers.length === 0 && (
                                    <div className="px-4 py-2 text-gray-500">
                                       No users found
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               ) : (
                  <div className="mb-4">
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Period
                     </label>
                     <div className="relative">
                        <button
                           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                           className="w-full py-2 px-4 text-left border border-gray-300 rounded-lg"
                        >
                           {selectedPeriod ? selectedPeriodName : "Select Period"}
                        </button>
                        {isDropdownOpen && (
                           <ul className="absolute w-full mt-1 bg-white border rounded-lg shadow-md max-h-48 overflow-y-auto z-10">
                              {Object.entries(PeriodType).map(([label, value]) => (
                                 <li
                                    key={value}
                                    onClick={() => handlePeriodChange(value)}
                                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                 >
                                    {label}
                                 </li>
                              ))}
                           </ul>
                        )}
                     </div>
                  </div>
               )}
               
               <div className="flex justify-between">
                  <button
                     onClick={() => setIsMobileFilterOpen(false)}
                     className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                     Close
                  </button>
                  <button
                     onClick={handleClearFilters}
                     className="py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                     Clear Filters
                  </button>
               </div>
            </div>
         )}
      </div>
   );

   return (
      <div className="w-full">
         {renderDesktopFilters()}
         {renderMobileFilters()}
      </div>
   );
};

export default FiltersComponent;
