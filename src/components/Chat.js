import React, {useContext, useEffect} from 'react';
import {ContextApp} from '../utils/Context';
import ReactMarkdown from 'react-markdown';
import {AiOutlineUser} from 'react-icons/ai';

function Chat() {
    const { message, msgEnd } = useContext(ContextApp);

    useEffect(() => {
        msgEnd?.current?.scrollIntoView({ behavior: 'smooth' });
      }, [message]);
      
    return (
        <div className=' w-full flex items-center justify-center overflow-hidden overflow-y-auto px-2 py-1 scroll'>
            <div className='w-full lg:w-4/5 flex flex-col h-full items-start justify-start'>
                {message?.map((msg, i) => (
                    <div key={i}>
                        <span
                            className={
                                msg.isBot
                                    ? 'flex items-start justify-center gap-2 lg:gap-5 my-2 bg-gray-200 p-3 rounded-md '
                                    : 'flex items-start justify-center gap-2 bg-blue-100 lg:gap-5 my-2 p-3'
                            }
                        >
                            {msg.isBot ? (
                                <img
                                    src={`${process.env.PUBLIC_URL}/icon.png`}
                                    alt='bot'
                                    className='w-10 h-10 rounded object-cover'
                                />
                            ) : (
                                <div className='w-10 h-10 flex items-center justify-center rounded-lg bg-blue-400 text-white font-bold'>
                                    <AiOutlineUser size={24} />
                                </div>
                            )}
                            <div>
                                {msg.file && (
                                    <div>
                                        {msg.file.match(/\.(jpg|png)$/i) &&
                                            <img
                                                className='h-24'
                                                src={msg.file}
                                                alt='Attachment'
                                            />
                                        }
                                    </div>
                                )}
                                <p className='text-gray-700 text-[15px] group px-3'>
                                    <ReactMarkdown>{msg?.text}</ReactMarkdown>
                                </p>
                            </div>
                        </span>
                    </div>
                ))}

                <div ref={msgEnd} />
            </div>
        </div>
    );
}

export default Chat;
