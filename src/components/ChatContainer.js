import React, {useContext, useState} from 'react';
import {ContextApp} from '../utils/Context';
import {LuPanelLeftClose, LuPanelLeftOpen} from 'react-icons/lu';
import {HiOutlineMenuAlt2} from 'react-icons/hi';
import {IoArrowUp} from 'react-icons/io5';
import Chat from './Chat';
import ChatModelDropdown from './ChatModelDropdown';

function ChatContainer() {
  const {
    selectedModel,
    setSelectedModel,
    setShowSlide,
    showSlide,
    setMobile,
    Mobile,
    chatValue,
    setChatValue,
    handleSend,
    handleKeyPress,
    fileData,
    setFileData,
    isLoading,
  } = useContext(ContextApp);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className={`h-full bg-gray-50 flex items-start flex-col p-2
        ${showSlide ? ' w-full ' : 'w-full lg:w-[calc(100%-250px)]'}
     `}
    >
      <div className="flex gap-4  mb-3">
        <span
          className="rounded px-3 py-[9px] hidden lg:flex items-center justify-center cursor-pointer text-gray-700 m-1 hover:bg-gray-600 duration-200"
          title="Open sidebar"
          onClick={() => setShowSlide(!showSlide)}
        >
          {showSlide ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
        </span>
        <span
          className="rounded px-3 py-[9px] lg:hidden flex items-center justify-center cursor-pointer text-gray-700 mt-0 border border-gray-600"
          title="Open sidebar"
          onClick={() => setMobile(!Mobile)}
        >
          <HiOutlineMenuAlt2 fontSize={20} />
        </span>
        {/* <div className="relative">
          <button
            className="text-gray-700 h-full text-start px-2 w-28"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedModel}
          </button>
          {isDropdownOpen && (
            <ChatModelDropdown
              onSelect={(model) => setSelectedModel(model)}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </div> */}
      </div>
      {/* chat section */}
      <div className="w-full h-full flex-1 flex items-start justify-center overflow-hidden overflow-y-auto scroll">
        <Chat />
      </div>

      {/* chat input section */}
      <div className="self-center h-fit w-[90%] lg:w-2/5 xl:w-1/2 flex rounded-lg shadow-md  items-center bg-gray-200 justify-center flex-col gap-2 my-2">
        <span className="w-full flex h-full gap-2 items-end">
          <textarea
            type="text"
            placeholder="Send a message"
            className="resize-none overflow-hidden overflow-y-auto scroll  h-full bg-transparent px-3 py-4 w-full border-none outline-none text-base "
            value={chatValue}
            onChange={(e) => setChatValue(e.target.value)}
            onKeyUp={handleKeyPress}
          
          />
          <div className="m-3 gap-3 flex">
            <IoArrowUp
              title="send message"
              className={` p-1 rounded-full text-3xl ${
                chatValue.length > 0 || fileData
                  ? 'text-white cursor-pointer bg-blue-800 shadow-md'
                  : 'text-gray-400 bg-blue-800/50'
              }`}
              aria-disabled={isLoading}
              onClick={() => { if (!isLoading) { handleSend(); } }}
            />
          </div>
        </span>
      </div>
    </div>
  );
}

export default ChatContainer;
