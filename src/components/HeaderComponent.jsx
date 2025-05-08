import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HeaderComponent = () => {
   const navigate = useNavigate();
   const location = useLocation();

   const isActive = (path) => location.pathname === path;

   return (
      <div className="border border-gray-300 bg-gray-100 w-full flex">
         <button
            onClick={() => navigate("/")}
            className={`w-1/2 p-4 text-2xl font-semibold transition-colors duration-500 ease-in-out
               ${isActive("/") ? "bg-white text-gray-700" : "text-gray-500 hover:bg-gray-200"}`}
         >
            Agent
         </button>
         <button
            onClick={() => navigate("/calls")}
            className={`w-1/2 p-4 text-2xl font-semibold transition-colors duration-500 ease-in-out
               ${isActive("/calls") ? "bg-white text-gray-700" : "text-gray-500 hover:bg-gray-200"}`}
         >
            Call Analyzer
         </button>
      </div>
   );
};

export default HeaderComponent;
