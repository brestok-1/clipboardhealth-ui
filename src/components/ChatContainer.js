import React, {useContext, useState} from 'react';
import {ContextApp} from '../utils/Context';
import {LuPanelLeftClose, LuPanelLeftOpen} from 'react-icons/lu';
import {HiOutlineMenuAlt2} from 'react-icons/hi';
import {IoArrowUp} from 'react-icons/io5';
import Chat from './Chat';

function ChatContainer() {
  const {
    selectedModel,
    setSelectedModel,
    setShowSlide,
    showSlide,
    setMobile,
    Mobile,
    handleSend,
    handleKeyPress,
    isLoading,
    message,
    showFacilityPopup,
    isSending,
  } = useContext(ContextApp);

  const [chatValue, setChatValue] = useState('');

  return (
    <div
      className={`h-full bg-gray-100 flex items-start flex-col p-2
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
      </div>

      <div className="w-full h-full flex-1 flex items-start justify-center overflow-hidden overflow-y-auto scroll">
        <Chat />
      </div>

      <div className="self-center h-fit w-[90%] lg:w-2/5 xl:w-1/2 flex rounded-lg shadow-md  items-center bg-gray-200 justify-center flex-col gap-2 my-2">
        <span className="w-full flex h-full gap-2 items-end">
          <textarea
            type="text"
            placeholder="Send a message"
            className="resize-none overflow-hidden overflow-y-auto scroll h-full bg-transparent px-3 py-4 w-full border-none outline-none text-base"
            value={chatValue}
            onChange={(e) => setChatValue(e.target.value)}
            onKeyUp={(e) => handleKeyPress && handleKeyPress(e, chatValue, setChatValue, null, null, null, null, handleSend)}
          />
          <div className="m-3 gap-3 flex">
            <IoArrowUp
              title="send message"
              className={`p-1 rounded-full text-3xl ${
                  chatValue.length > 0
                  ? 'text-white cursor-pointer bg-blue-800 shadow-md'
                  : 'text-gray-400 bg-blue-800/50'
              }`}
              aria-disabled={isLoading || isSending}
              onClick={() => {
                if (!isLoading && !isSending && chatValue.length > 0) {
                  handleSend && handleSend(chatValue, setChatValue, null, null, null, null);
                }
              }}
            />
          </div>
        </span>
      </div>

    </div>
  );
}

export default ChatContainer;
