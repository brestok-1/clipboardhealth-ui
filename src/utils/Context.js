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
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingChats, setIsLoadingChats] = useState(false);

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
            setIsLoadingMessages(true);
            
            try {
                const result = await getAllChatMessages(token, chatId);

                if (result.data?.length > 0) {
                    const formattedMessages = result.data.map((msg) => ({
                        text: msg.content,
                        isBot: msg.role === 'ai',
                        type: msg.role === 'ai' ? 'ai' : 'user',
                        steps: [], // добавляем пустой массив steps для совместимости
                        file: msg?.fileUrl,
                        isStreaming: false // загруженные сообщения не стримятся
                    }));

                    setMessage(formattedMessages);
                } else {
                    setMessage([]);
                }
            } catch (error) {
                console.error("Error loading chat messages:", error);
                setMessage([]);
            } finally {
                setIsLoadingMessages(false);
            }
        }
    };

    // Добавить функцию для стриминга сообщений
    const sendStreamingMessage = async (token, chatId, chatValue, updateMessages) => {
        try {
            updateMessages((prev) => [
                ...prev,
                { text: chatValue, isBot: false, type: 'user' },
            ]);
            
            let currentAgentMessage = {
                text: '',
                isBot: true,
                type: 'ai',
                steps: [], // массив для tool/tool_query/tool_response
                isStreaming: true // добавляем флаг для отслеживания стриминга
            };
            
            let agentMessageAdded = false; // флаг для отслеживания добавления сообщения агента
            
            let eventSource;
            const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/agent/${chatId}?query=${encodeURIComponent(chatValue)}&token=${token}`;
            eventSource = new window.EventSource(url);

            eventSource.onmessage = (event) => {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                    return;
                }
                
                // Приводим text к строке, если это не строка
                if (data.text && typeof data.text !== 'string') {
                    data.text = JSON.stringify(data.text);
                }
                
                // Добавляем сообщение агента при первом ответе от сервера
                if (!agentMessageAdded) {
                    updateMessages((prev) => [...prev, currentAgentMessage]);
                    agentMessageAdded = true;
                }
                
                if (data.type === 'ai_token') {
                    currentAgentMessage.text += data.text || '';
                    currentAgentMessage.isStreaming = true; // все еще стримится
                    updateMessages((prev) => {
                        // обновляем только последнее сообщение (текущее сообщение агента)
                        return [...prev.slice(0, -1), { ...currentAgentMessage }];
                    });
                } else if (["tool", "tool_query", "tool_response"].includes(data.type)) {
                    currentAgentMessage.steps.push({ ...data });
                    currentAgentMessage.isStreaming = true; // агент думает
                    updateMessages((prev) => {
                        // обновляем только последнее сообщение (текущее сообщение агента)
                        return [...prev.slice(0, -1), { ...currentAgentMessage }];
                    });
                } else if (data.type === 'ai') {
                    currentAgentMessage.text = data.text || '';
                    currentAgentMessage.isStreaming = false; // стриминг завершен
                    updateMessages((prev) => {
                        // обновляем только последнее сообщение (текущее сообщение агента)
                        return [...prev.slice(0, -1), { ...currentAgentMessage }];
                    });
                }
            };
            eventSource.onerror = () => {
                currentAgentMessage.isStreaming = false;
                updateMessages((prev) => {
                    return [...prev.slice(0, -1), { ...currentAgentMessage }];
                });
                eventSource.close();
            };
        } catch (error) {
            updateMessages((prev) => [
                ...prev,
                { text: 'Error: ' + error.message, isBot: true, type: 'ai', steps: [], isStreaming: false },
            ]);
        }
    };

    const handleSend = async () => {
        const text = chatValue;
        setChatValue('');
        setIsLoading(true);
        const token = Cookies.get('accessToken');
        if (!selectedChat) {
            try {
                const newChat = await createChat(token);
                if (newChat) {
                    setSelectedChat(newChat.data.id);
                    setMobile(false);
                    await sendStreamingMessage(
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
            await sendStreamingMessage(
                token,
                selectedChat,
                text,
                setMessage,
            );
        }
        setIsLoading(false);
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
            setIsLoadingChats(true);
            const token = Cookies.get('accessToken');
            if (!token) {
                return { account: null, statusCode: 401 };
            }
            const response = await getChats(token, 0, 100);
            if (response.data) {
                setChats(response.data);
            } else {
                console.log(response.error);
            }
        } catch (error) {
            console.log(error.message || 'Error creating chat');
        } finally {
            setIsLoadingChats(false);
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
                isLoading,
                isLoadingMessages,
                isLoadingChats
            }}
        >
            {children}
        </ContextApp.Provider>
    );
};
export default AppContext;
