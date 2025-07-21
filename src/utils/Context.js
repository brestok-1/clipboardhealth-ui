import {createContext, useEffect, useRef, useState} from 'react';
import Cookies from 'js-cookie';
import {getAllChatMessages,} from '../api/messageApi';
import {createChat, getChatById, getChats} from '../api/chatApi';

export const ContextApp = createContext();

const AppContext = ({ children }) => {
    const [showSlide, setShowSlide] = useState(false);
    const [Mobile, setMobile] = useState(false);
    const [chats, setChats] = useState([]);
    const [account, setAccount] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState([]);
    const [fileData, setFileData] = useState(null);
    const [isLoading, setIsLoading] =useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [pendingMessage, setPendingMessage] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const [selectedChat, setSelectedChat] = useState(null);
    const msgEnd = useRef(null);

    useEffect(() => {
        if (msgEnd.current) {
            msgEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message.length]);

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
                        steps: [],
                        file: msg?.fileUrl,
                        isStreaming: false,
                        shifts: Array.isArray(msg.shifts) ? msg.shifts : [],
                        stream: []
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
                steps: [],
                isStreaming: true,
                stream: []
            };

            let agentMessageAdded = false;

            let eventSource;
            const url = `https://api.cbhexp.com/api/agent/${chatId}?query=${encodeURIComponent(chatValue)}&token=${token}`;
            eventSource = new window.EventSource(url);

            eventSource.onmessage = (event) => {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                    return;
                }

                if (data.text && typeof data.text !== 'string') {
                    data.text = JSON.stringify(data.text);
                }

                if (!agentMessageAdded) {
                    updateMessages((prev) => [...prev, currentAgentMessage]);
                    agentMessageAdded = true;
                }

                if (data.type === 'ai_token') {
                    currentAgentMessage.text += data.text || '';

                    const lastStreamItem = currentAgentMessage.stream[currentAgentMessage.stream.length - 1];
                    if (lastStreamItem && lastStreamItem.type === 'thinking' && lastStreamItem.isActive) {
                        lastStreamItem.isActive = false;
                    }

                    if (lastStreamItem && lastStreamItem.type === 'text') {
                        lastStreamItem.content += data.text || '';
                    } else {
                        currentAgentMessage.stream.push({type: 'text', content: data.text || ''});
                    }

                    currentAgentMessage.isStreaming = true;
                    updateMessages((prev) => {
                        return [...prev.slice(0, -1), {...currentAgentMessage}];
                    });
                } else if (["tool", "tool_query", "tool_response"].includes(data.type)) {
                    currentAgentMessage.steps.push({...data});

                    const lastStreamItem = currentAgentMessage.stream[currentAgentMessage.stream.length - 1];
                    if (lastStreamItem && lastStreamItem.type === 'thinking') {
                        lastStreamItem.steps.push({...data});
                    } else {
                        currentAgentMessage.stream.push({
                            type: 'thinking',
                            steps: [{...data}],
                            isActive: true
                        });
                    }

                    currentAgentMessage.isStreaming = true;
                    updateMessages((prev) => {
                        return [...prev.slice(0, -1), {...currentAgentMessage}];
                    });
                } else if (data.type === 'ai_thoughts') {
                    currentAgentMessage.steps.push({...data});
                    const lastStreamItem = currentAgentMessage.stream[currentAgentMessage.stream.length - 1];
                    if (lastStreamItem && lastStreamItem.type === 'thinking') {
                        lastStreamItem.steps.push({...data});
                    } else {
                        currentAgentMessage.stream.push({
                            type: 'thinking',
                            steps: [{...data}],
                            isActive: true
                        });
                    }
                    currentAgentMessage.isStreaming = true;
                    updateMessages((prev) => {
                        return [...prev.slice(0, -1), {...currentAgentMessage}];
                    });
                } else if (data.type === 'ai') {
                    currentAgentMessage.isStreaming = false;

                    if (data.text && data.text.trim() !== '' && data.text !== currentAgentMessage.text) {
                        const lastStreamItem = currentAgentMessage.stream[currentAgentMessage.stream.length - 1];
                        if (lastStreamItem && lastStreamItem.type === 'text') {
                            lastStreamItem.content += data.text;
                        } else {
                            currentAgentMessage.stream.push({type: 'text', content: data.text});
                        }
                        currentAgentMessage.text += data.text;
                    }

                    updateMessages((prev) => {
                        return [...prev.slice(0, -1), {...currentAgentMessage}];
                    });
                }
            };
            eventSource.onerror = () => {
                currentAgentMessage.isStreaming = false;
                updateMessages((prev) => {
                    return [...prev.slice(0, -1), {...currentAgentMessage}];
                });
                eventSource.close();
            };
        } catch (error) {
            updateMessages((prev) => [
                ...prev,
                {text: 'Error: ' + error.message, isBot: true, type: 'ai', steps: [], isStreaming: false},
            ]);
        }
    };

    const handleSend = async (chatValue, setChatValue, setFileData, chatMode, uploadedFileId, fileData) => {
        if (isSending) {
            return;
        }

        const text = chatValue;
        const file = fileData;

        setChatValue && setChatValue('');
        setFileData && setFileData(null);
        setIsLoading(true);
        setIsSending(true);
        const token = Cookies.get('accessToken');

        const handleFileUploadFlow = async (chatId, userMessage) => {
            await sendStreamingMessage(token, chatId, userMessage, setMessage);
        };

        if (!selectedChat) {
            try {
                const newChat = await createChat(token);
                if (newChat && newChat.successful) {
                    setSelectedChat(newChat.data.id);
                    setMobile(false);
                    await handleFileUploadFlow(newChat.data.id, text);
                } else {
                    console.error('Failed to create a new chat');
                }
            } catch (error) {
                console.error('Error creating new chat:', error);
            }
            getAllChats();
        } else {
            await handleFileUploadFlow(selectedChat, text);
        }
        setIsLoading(false);
        setIsSending(false);
    };

    const createNewChat = () => {
        setSelectedChat(null);
        setMessage([]);
    };

    const handleKeyPress = (e, chatValue, setChatValue, setFileData, chatMode, uploadedFileId, fileData, handleSend) => {
        if (!isLoading && !isSending) {
            if (e.key === 'Enter') {
                if (e.shiftKey) {
                    return;
                }
                e.preventDefault();
                if (chatMode === 'File' && !uploadedFileId && !fileData) {
                    return;
                }
                if (chatValue.trim() !== '' || fileData) {
                    handleSend && handleSend(chatValue, setChatValue, setFileData, chatMode, uploadedFileId, fileData);
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

                await loadChatMessages(chatId)
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
            // Determine chat type based on current chat mode
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
                chats,
                setChats,
                account,
                setAccount,
                status,
                setStatus,
                message,
                setMessage,
                fileData,
                setFileData,
                isLoading,
                setIsLoading,
                isLoadingMessages,
                setIsLoadingMessages,
                isLoadingChats,
                setIsLoadingChats,
                handleSend,
                handleKeyPress,
                selectedChat,
                setSelectedChat,
                msgEnd,
                loadChatMessages,
                selectedChatById,
                getAllChats,
                createNewChat,
                isSending
            }}
        >
            {children}
        </ContextApp.Provider>
    );
};
export default AppContext;
