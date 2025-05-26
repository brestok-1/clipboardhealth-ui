import React, {useContext, useEffect, useState} from 'react';
import {ContextApp} from '../utils/Context';
import ReactMarkdown from 'react-markdown';
import {AiOutlineUser} from 'react-icons/ai';
import {IoChevronDown, IoChevronForward} from 'react-icons/io5';
import ChatSkeleton from './ChatSkeleton';

function AgentThoughts({ steps, isStreaming }) {
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
                        Agent is thinking...
                    </span>
                    {isStreaming && (
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
                            const textContent = typeof step.text === 'string' ? step.text : JSON.stringify(step.text, null, 2);
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
}

function Chat() {
    const { message, msgEnd, isLoadingMessages } = useContext(ContextApp);

    useEffect(() => {
        msgEnd?.current?.scrollIntoView({ behavior: 'smooth' });
      }, [message, msgEnd]);
      
    if (isLoadingMessages) {
        return <ChatSkeleton />;
    }
    
    return (
        <div className='w-full flex items-center justify-center overflow-hidden overflow-y-auto px-1 sm:px-2 py-1 scroll'>
            <div className='w-full lg:w-4/5 flex flex-col h-full items-start justify-start'>
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
                                        <ReactMarkdown>{textContent}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    if (msg.type === 'ai' || msg.isBot) {
                        // Use the isStreaming flag from the message object
                        const isStreaming = msg.isStreaming || false;
                        
                        return (
                            <div key={i} className="flex items-start gap-2 bg-gray-200 my-1 sm:my-2 p-2 sm:p-3 rounded-md w-full">
                                <img
                                    src={`${process.env.PUBLIC_URL}/icon.png`}
                                    alt='bot'
                                    className='w-8 h-8 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0'
                                />
                                <div className="flex-1 min-w-0">
                                    {/* Show agent thoughts if there are steps */}
                                    <AgentThoughts steps={msg.steps} isStreaming={isStreaming} />
                                    
                                    {/* Main agent response */}
                                    {textContent && textContent.trim() !== '' && (
                                        <div className='text-gray-700 text-sm sm:text-[15px] group px-1 sm:px-3'>
                                            <ReactMarkdown>{textContent}</ReactMarkdown>
                                        </div>
                                    )}
                                    
                                    {/* Show typing indicator if streaming and no content yet */}
                                    {isStreaming && (!textContent || textContent.trim() === '') && (!msg.steps || msg.steps.length === 0) && (
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
}

export default Chat;