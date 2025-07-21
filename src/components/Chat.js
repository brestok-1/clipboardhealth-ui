import React, {memo, useContext, useEffect, useMemo, useState} from 'react';
import {ContextApp} from '../utils/Context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {AiOutlineUser} from 'react-icons/ai';
import {IoChevronDown, IoChevronForward} from 'react-icons/io5';
import ChatSkeleton from './ChatSkeleton';

const LoadingAnimation = memo(({isLoaded = false}) => {
    return (
        <div className="flex items-center gap-2 px-1 sm:px-3 py-2">
            <div className="flex items-center gap-1">
                <div
                    className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-gray-400' : 'bg-blue-500'} ${!isLoaded ? 'loading-dot' : ''}`}></div>
                <div
                    className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-gray-400' : 'bg-blue-500'} ${!isLoaded ? 'loading-dot' : ''}`}></div>
                <div
                    className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-gray-400' : 'bg-blue-500'} ${!isLoaded ? 'loading-dot' : ''}`}></div>
            </div>
            <span className={`text-xs sm:text-sm ${isLoaded ? 'text-gray-400' : 'text-blue-600'}`}>
                {isLoaded ? 'Loaded' : 'Loading...'}
            </span>
        </div>
    );
});

const AgentThoughts = memo(({steps, isStreaming, isThinking}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!steps || steps.length === 0) return null;

    const getStepTypeLabel = (type) => {
        switch (type) {
            case 'tool': return 'Using Tool';
            case 'tool_query': return 'Tool Query';
            case 'tool_response': return 'Tool Response';
            default: return 'Processing';
        }
    };

    const getStepTypeColor = (type) => {
        switch (type) {
            case 'tool': return 'border-blue-400 bg-blue-50';
            case 'tool_query': return 'border-yellow-400 bg-yellow-50';
            case 'tool_response': return 'border-green-400 bg-green-50';
            default: return 'border-gray-400 bg-gray-50';
        }
    };

    const formatTextContent = (text, stepType) => {
        if (!text) return '';
        let content = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
        if (stepType === 'tool_response') {
            content = content.replace(/\\n/g, '\n');
            content = content.replace(/\\t/g, '\t');
            content = content.replace(/\\"/g, '"');
            content = content.replace(/\\\\/g, '\\');
            if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
                try {
                    const parsed = JSON.parse(content);
                    content = JSON.stringify(parsed, null, 2);
                } catch (e) {}
            }
        }
        return content;
    };

    return (
        <div className="mb-2 sm:mb-3 border border-gray-300 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-100 hover:bg-gray-150 transition-colors agent-thoughts-button"
            >
                <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                    {isExpanded ? (
                        <IoChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    ) : (
                        <IoChevronForward className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                        {isThinking ? 'Agent is thinking...' : 'Agent thoughts'}
                    </span>
                    {isThinking && (
                        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full thinking-dot"></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full thinking-dot"></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full thinking-dot"></div>
                        </div>
                    )}
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-1 sm:ml-2">
                    {steps.length} step{steps.length !== 1 ? 's' : ''}
                </span>
            </button>
            {isExpanded && (
                <div className="p-2 sm:p-3 bg-white border-t border-gray-200">
                    <div className="space-y-2">
                        {steps.map((step, index) => {
                            const textContent = formatTextContent(step.text, step.type);
                            return (
                                <div key={index} className={`p-2 sm:p-3 rounded-md border-l-4 ${getStepTypeColor(step.type)}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            {getStepTypeLabel(step.type)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Step {index + 1}
                                        </span>
                                    </div>
                                    <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700 font-mono bg-white p-2 rounded border overflow-x-auto max-w-full">
                                        {textContent}
                                    </pre>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
});

const TableWithCollapse = memo(({children}) => {
    const [expanded, setExpanded] = useState(false);
    let thead = null;
    let tbody = null;
    React.Children.forEach(children, child => {
        if (child && child.type === 'thead') thead = child;
        if (child && child.type === 'tbody') tbody = child;
    });
    const rowCount = tbody ? React.Children.count(tbody.props.children) : 0;
    const shouldCollapse = rowCount > 10;
    const visibleRows = useMemo(() => {
        if (!tbody) return null;
        if (!shouldCollapse) return tbody.props.children;
        const allRows = [];
        React.Children.forEach(tbody.props.children, (row, idx) => {
            if (expanded || idx < 10) {
                allRows.push(row);
            }
        });
        return allRows;
    }, [tbody, expanded, shouldCollapse]);
    if (!tbody) return <table>{children}</table>;
    return (
        <div className="table-container">
            <table>
                {thead}
                <tbody>
                {visibleRows}
                </tbody>
            </table>
            {shouldCollapse && (
                <div className="flex justify-center my-2">
                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                        onClick={() => setExpanded(e => !e)}
                    >
                        {expanded ? 'Hide' : `Show all (${rowCount})`}
                    </button>
                </div>
            )}
        </div>
    );
});

const Chat = memo(() => {
    const {message, msgEnd, isLoadingMessages} = useContext(ContextApp);
    const [loadedMessages, setLoadedMessages] = useState(new Set());

    useEffect(() => {
        msgEnd?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message.length, msgEnd]);

    useEffect(() => {
        message.forEach((msg, index) => {
            if (msg.type === 'ai' || msg.isBot) {
                if (msg.loading === false || (msg.loading === true && (
                    (msg.text && msg.text.trim() !== '') ||
                    (msg.stream && msg.stream.length > 0) ||
                    (msg.steps && msg.steps.length > 0)
                ))) {
                    setLoadedMessages(prev => new Set(prev).add(index));
                }
            }
        });
    }, [message]);

    if (isLoadingMessages) {
        return <ChatSkeleton />;
    }

    return (
        <div className='w-full flex items-center justify-center overflow-hidden overflow-y-auto px-1 sm:px-2 py-1 scroll'>
            <div className='w-full lg:w-4/5 flex flex-col h-full items-start justify-start'>
                {message?.length === 0 && (
                    <div className="flex items-start gap-2 bg-gray-200 my-1 sm:my-2 p-2 sm:p-3 rounded-md w-full">
                        <img
                            src={`${process.env.PUBLIC_URL}/icon.png`}
                            alt='bot'
                            className='w-8 h-8 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0'
                        />
                        <div className="flex-1 min-w-0">
                            <div className='text-gray-700 text-sm sm:text-[15px] group px-1 sm:px-3'>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        table: TableWithCollapse
                                    }}
                                >
{`Welcome to the Global AI Agent! 🤖

I'm here to answer your questions and provide any type of statistics, leveraging the Clipboard Health data available.

Ask me anything—from data insights to operational questions—and I'll do my best to assist you!`}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
                {message?.map((msg, i) => {
                    const textContent = typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text);
                    if (msg.type === 'user') {
                        return (
                            <div key={i} className="flex items-start gap-2 bg-blue-100 my-1 sm:my-2 p-2 sm:p-3 rounded-md w-full">
                                <div className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-blue-400 text-white font-bold flex-shrink-0'>
                                    <AiOutlineUser size={16} className="sm:hidden" />
                                    <AiOutlineUser size={24} className="hidden sm:block" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className='text-gray-700 text-sm sm:text-[15px] group px-1 sm:px-3'>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                table: TableWithCollapse
                                            }}
                                        >
                                            {textContent}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    if (msg.type === 'ai' || msg.isBot) {
                        const isStreaming = msg.isStreaming || false;
                        const isLoaded = loadedMessages.has(i);
                        const showLoading = msg.loading === true && !isLoaded;
                        return (
                            <div key={i} className="flex items-start gap-2 bg-gray-200 my-1 sm:my-2 p-2 sm:p-3 rounded-md w-full">
                                <img
                                    src={`${process.env.PUBLIC_URL}/icon.png`}
                                    alt='bot'
                                    className='w-8 h-8 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0'
                                />
                                <div className="flex-1 min-w-0">
                                    {showLoading && (
                                        <LoadingAnimation isLoaded={isLoaded}/>
                                    )}
                                    {msg.stream && msg.stream.length > 0 ? (
                                        <div>
                                            {msg.stream.map((item, streamIndex) => {
                                                if (item.type === 'text') {
                                                    return (
                                                        <div key={streamIndex}
                                                             className='text-gray-700 text-sm sm:text-[15px] group px-1 sm:px-3'>
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    table: TableWithCollapse
                                                                }}
                                                            >
                                                                {item.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    );
                                                } else if (item.type === 'thinking') {
                                                    return (
                                                        <div key={streamIndex}>
                                                            <AgentThoughts
                                                                steps={item.steps}
                                                                isStreaming={item.isActive}
                                                                isThinking={item.isActive}
                                                            />
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    ) : (
                                        <div>
                                            {textContent && textContent.trim() !== '' && (
                                                <div
                                                    className='text-gray-700 text-sm sm:text-[15px] group px-1 sm:px-3'>
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            table: TableWithCollapse
                                                        }}
                                                    >
                                                        {textContent}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                            <AgentThoughts steps={msg.steps} isStreaming={isStreaming}/>
                                        </div>
                                    )}
                                    {isStreaming && (!textContent || textContent.trim() === '') && (!msg.steps || msg.steps.length === 0) && !msg.loading && (
                                        <div className="flex items-center gap-2 px-1 sm:px-3 py-2">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full typing-dot"></div>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full typing-dot"></div>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full typing-dot"></div>
                                            </div>
                                            <span className="text-xs sm:text-sm text-gray-500">Agent is typing...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
                <div ref={msgEnd} />
            </div>
        </div>
    );
});

export default Chat;