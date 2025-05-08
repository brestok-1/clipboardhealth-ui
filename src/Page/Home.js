import React from "react";
import LeftNav from "../components/LeftNav";
import ChatContainer from "../components/ChatContainer";
import Mobile from "../components/Mobile";
import HeaderComponent from "../components/HeaderComponent";

function Home() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="h-auto flex-shrink-0">
        <HeaderComponent />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <ChatContainer />
        <span className="flex lg:hidden">
          <Mobile />
        </span>
      </div>
    </div>
  );
}


export default Home;
