import {createContext, useEffect, useRef, useState} from 'react';
import Cookies from 'js-cookie';
import {getAllChatMessages, sendMessage,} from '../api/messageApi';
import {createChat, getChatById, getChats} from '../api/chatApi';

export const ContextApp = createContext();

const AppContext = ({ children }) => {
    const [showSlide, setShowSlide] = useState(false);
    const [Mobile, setMobile] = useState(false);
    const [chats, setChats] = useState([]);
    const [chatValue, setChatValue] = useState('');
    const [account, setAccount] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState([]);
    const [fileData, setFileData] = useState(null);
    const [isLoading, setIsLoading] =useState(false);

    const [selectedChat, setSelectedChat] = useState(null);
    const msgEnd = useRef(null);

    useEffect(() => {
        if (msgEnd.current) {
            msgEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message]);

    const loadChatMessages = async (chatId) => {
        console.log(chatId)
        const token = Cookies.get('accessToken');

        if (chatId) {
            const result = await getAllChatMessages(token, chatId);

            if (result.data?.length > 0) {
                const formattedMessages = result.data.map((msg) => ({
                    text: msg.content,
                    isBot: msg.role === 'ai',
                    file: msg?.fileUrl,
                }));

                setMessage(formattedMessages);
            }
        }
    };

    // button Click function
    const handleSend = async () => {
        const text = chatValue;
        setChatValue('');
        let fileUrl = null;
        setIsLoading(true);
        setMessage((prevMessages) => [
            ...prevMessages,
            {text, isBot: false},
        ]);

        const token = Cookies.get('accessToken');
        if (!selectedChat) {
            try {
                const newChat = await createChat(token);
                if (newChat) {
                    setSelectedChat(newChat.data.id);
                    await sendMessage(
                        token,
                        newChat.data.id,
                        text,
                        setMessage,
                    );

                   
                } else {
                    console.error('Failed to create a new chat');
                }
            } catch (error) {
                console.error('Error creating new chat:', error);
            }
            getAllChats();
        } else {
            await sendMessage(
                token,
                selectedChat,
                text,
                setMessage,
            );
        }
        setIsLoading(false)
    };

    const handleKeyPress = (e) => {
        if(!isLoading) {
        if (e.key === 'Enter') {
            if (chatValue.trim() !== '' || fileData) {
                handleSend();
            }
        }
    }
    };

    const selectedChatById = async (chatId) => {
        try {
            const token = Cookies.get('accessToken');
            const chat = await getChatById(chatId, token);
            if (chat) {
                setSelectedChat(chatId);
                setMessage([])
                loadChatMessages(chatId);
            }
        } catch (error) {
            console.error('Error fetching chat by ID:', error.message);
        }
    };

    const getAllChats = async () => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                return { account: null, statusCode: 401 };
            }
            const response = await getChats(token, 0, 10);
            if (response.data) {
                setChats(response.data);
            } else {
                console.log(response.error);
            }
        } catch (error) {
            console.log(error.message || 'Error creating chat');
        }
    };

    useEffect(() => {
        getAllChats();
    }, []);


    return (
        <ContextApp.Provider
            value={{
                showSlide,
                setShowSlide,
                Mobile,
                setMobile,
                chatValue,
                setChatValue,
                handleSend,
                message,
                setMessage,
                chats,
                msgEnd,
                handleKeyPress,
                account,
                status,
                loadChatMessages,
                setSelectedChat,
                selectedChat,
                selectedChatById,
                setFileData,
                getAllChats,
                setChats,
                fileData,
                isLoading
            }}
        >
            {children}
        </ContextApp.Provider>
    );
};
export default AppContext;
