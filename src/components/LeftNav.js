import React, {useContext, useState} from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import {FiMessageSquare, FiMoreHorizontal} from 'react-icons/fi';
import {ContextApp} from '../utils/Context';
import Cookies from 'js-cookie';
import {deleteChat, updateTitle} from '../api/chatApi';
import ModalMore from './ModalMore';
import {useNavigate} from 'react-router-dom';
import ChatListSkeleton from './ChatListSkeleton';

function LeftNav() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({ bottom: 0, right: 0 });
  const [newTitle, setNewTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const {
    showSlide,
    getAllChats,
    chats,
    setChats,
    setSelectedChat,
    selectedChat,
    selectedChatById,
    loadChatMessages,
    isLoadingChats,
    setMessage,
    resetFileUpload,
    createNewChat,
  } = useContext(ContextApp);

  const handleSelectChat = (chatId) => {
    selectedChatById(chatId);
  };

  function handleLogout() {
    setSelectedChat(null);
    setChats([]);
    Cookies.remove('accessToken', {
      path: '/',
      secure: true,
      sameSite: 'strict'
    });
    navigate('/auth/login');
  }

  const handleOpenModal = (e, chatId) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({
      top: buttonRect.top - 20,
      left: buttonRect.left,
    });
    setIsModalOpen(true);
    setSelectedChatId(chatId);
  };

  const handleRename = () => {
    setIsModalOpen(false);
    setIsEditing(true);
    const chat = chats.find((c) => c.id === selectedChatId);
    setNewTitle(chat.title);
  };

  const handleSaveTitle = async () => {
    const token = Cookies.get('accessToken');
    if (!selectedChatId) return;

    try {
      const response = await updateTitle(selectedChatId, token, newTitle);
      if (response.successful) {
        console.log('update');
      } else {
        console.error('Failed to update title:', response.message);
        alert(response.message);
      }
    } catch (error) {
      console.error('Error updating title:', error);
      alert('Unexpected error occurred while updating title.');
    } finally {
      setIsEditing(false);
      setSelectedChatId(null);
      setNewTitle('');
    }
    getAllChats();
  };

  const handleDelete = async (chatId) => {
    const token = Cookies.get('accessToken');
    try {
      const response = await deleteChat(chatId, token);
      if (response.successful) {
        console.log('Chat deleted successfully:', response);
        setSelectedChat(null);
        setIsModalOpen(false);
        setSelectedChatId(null);
        setMessage([]);
        resetFileUpload();
        loadChatMessages(null);
      } else {
        console.error('Error deleting chat:', response.message);
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
    getAllChats();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



  const isLoggedIn = !!Cookies.get('accessToken');

  const renderChatList = () => {
    if (isLoadingChats) {
      return <ChatListSkeleton />;
    }

    if (chats && chats.length > 0) {
      return chats.map((chat) => (
        <div
          key={chat.id}
          className={`rounded-lg w-full py-2 px-3 text-xs my-2 flex items-center justify-between cursor-pointer hover:bg-gray-300 transition-all duration-300 overflow-hidden truncate whitespace-nowrap ${
            chat.id === selectedChat ? 'bg-gray-200' : ''
          }`}
          onClick={() => handleSelectChat(chat.id)}
        >
          {selectedChatId === chat.id && isEditing ? (
            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800"
                value={newTitle}
                autoFocus
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveTitle();
                  }
                }}
                onBlur={handleSaveTitle}
              />
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-3">
                <FiMessageSquare fontSize={20} />
                <span className="text-base">{chat.title}</span>
              </div>
              <button
                className="ml-auto flex p-2 items-center justify-end"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(e, chat.id);
                }}
              >
                <FiMoreHorizontal fontSize={20} />
              </button>
            </div>
          )}
        </div>
      ));
    }

    return <p>No chats available</p>;
  };

  return (
    <div
      className={
        !showSlide
            ? 'h-full min-h-0 bg-white w-[250px] hidden lg:flex flex-col p-2 text-gray-700 translate-x-0'
          : 'hidden'
      }
    >
      <div className="flex items-center justify-between w-full flex-shrink-0">
        <span className="text-xl font-semibold">Chatbot</span>
        <button
          className="rounded px-3 py-[9px] hidden lg:flex items-center justify-center cursor-pointer text-gray-700 m-1 hover:bg-gray-100 duration-200"
          onClick={createNewChat}
        >
          <AiOutlinePlus fontSize={16} />
        </button>
      </div>
      <div className="flex-1 min-h-0 w-full p-2 flex flex-col overflow-y-auto text-sm scroll my-2">
        {renderChatList()}
      </div>
      <button
        onClick={isLoggedIn ? handleLogout : () => navigate('/auth/login')}
        className="text-lg font-geist bg-gray-200 duration-300 truncate mb-2 hover:bg-gray-300 py-3 rounded-lg w-full flex-shrink-0"
      >
        {isLoggedIn ? 'Log Out' : 'Log In'}
      </button>

      <ModalMore
        isOpen={isModalOpen}
        onRename={handleRename}
        onDelete={() => handleDelete(selectedChatId)}
        onClose={handleCloseModal}
        position={buttonPosition}
      />
    </div>
  );
}

export default LeftNav;
