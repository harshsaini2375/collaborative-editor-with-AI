import React from 'react'
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Orb from './Orb';

const Chatbot = ({ documentId }) => {
    const [inputDiv, setinputDiv] = useState(false)
    const [CurrentDateTime, setCurrentDateTime] = useState()
    const [newmessage, setnewmessage] = useState('')
    const [messagearray, setmessagearray] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagearray]);

    useEffect(() => {
        if (messagearray.length == 1) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            setCurrentDateTime(`Today ${timeString}`);
        }
    }, [messagearray]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newmessage.trim() || isLoading) return;

        // // store user message to array
        const userMessage = { role: 'user', content: newmessage, timestamp: new Date() };
        setmessagearray(prevArray => {
            const newArray = [...prevArray, userMessage];
            return newArray;
        });
        setnewmessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: newmessage,
                    documentId: documentId,
                    context: 'document collaboration'
                })
            });

            const data = await response.json();

            if (data.response) {
                const aiMessage = {
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date()
                };
                setmessagearray(prevArray => {
                    const newArray = [...prevArray, aiMessage];
                    return newArray;
                });
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setmessagearray(prevArray => {
                const newArray = [...prevArray, errorMessage];
                return newArray;
            });
        } finally {
            setIsLoading(false);
        }

    }


    return (
        <div >

            <div className='Artificial intelligence relative h-[98vh] md:h-[89vh] w-full bg-white rounded-2xl  p-2 flex flex-col justify-end 
        md:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        md:hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300  '>
            {messagearray.length === 0 && <div className='AI_Assist font-bold flex gap-2 top-4 left-4 absolute items-center'><Image src={'/sparkle.svg'} alt='sparkle' height={30} width={30}/>AI assist</div>}

                {/* Orb fixed behind AI_Chat */}
                <div className="absolute top-[20vh]  left-0  w-full h-[40vh] z-0 overflow-hidden">
                    <Orb
                       
                        hoverIntensity={0.5}
                        rotateOnHover={true}
                        hue={0}
                        forceHoverState={false}
                    />
                </div>

                {messagearray.length === 0 ? (<h1 className='text-xl font-bold ml-2 mb-6 z-10'>How can I help you today?</h1>) : (
                    <div className='AI_Chat  z-10 text-sm h-[78vh] overflow-auto no-scrollbar flex flex-col '>

                        <div className='curr_time text-gray-300 text-xs text-center'>{CurrentDateTime}</div>

                        {messagearray.map((msg, index) => (
                            <div key={index} className={`my_question_OR_AI_Response mt-4 rounded-xl px-3   py-1 ${msg.role === 'user' ? "bg-gradient-to-r from-[#8150f2] to-[#407cf5] text-white h-fit max-w-[80vw] md:max-w-[17vw] self-end " : " bg-white w-full h-fit border-2  border-gray-300  hover:bg-[#f7f7f7]"}`} >
                                {/* to format AI response so that it looks good */}
                                {msg.role === 'assistant' ? (
                                    <div className="text-sm space-y-2">
                                        {msg.content.split('\n\n').map((paragraph, pIndex) => (
                                            <p key={pIndex} className="leading-relaxed">
                                                {paragraph.split('**').map((text, i) =>
                                                    i % 2 === 1 ? (
                                                        <strong key={i} className="font-semibold text-gray-900">{text}</strong>
                                                    ) : (
                                                        <span key={i}>{text}</span>
                                                    )
                                                )}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    /* For user messages (simple text) */
                                    <p className="text-sm">{msg.content}</p>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="text-left my-3">
                                <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-1 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-sm text-gray-600 mr-2">AI is thinking</span>
                                        <div className="flex space-x-1">
                                            <div className="h-1 w-1 bg-blue-500 rounded-full animate-wave" style={{ animationDelay: '0s' }}></div>
                                            <div className="h-1 w-1 bg-purple-500 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="h-1 w-1 bg-pink-500 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />

                        {/* Fade Overlay - Bottom Only */}
                        <div className="absolute bottom-14 mt-1 left-0 right-0 z-10 py-3 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none "></div>

                    </div>
                )}



                {/* <div className='more_actions w-full my-2 text-gray-500 flex justify-between'>
                  
                </div> */}
                <div className={`takeInput border-2 z-20  rounded-3xl w-full h-fit px-5 py-1 flex justify-between items-center ${inputDiv ? "border-[#2584e2]" : "border-gray-300"}`} >

                    <textarea placeholder='Ask AI anything...' className=' w-[75vw] md:w-[17vw] text-sm focus:outline-none resize-none  no-scrollbar overflow-y-auto min-h-[40px] max-h-[40px] md:max-h-[120px]'
                        onChange={(e) => setnewmessage(e.target.value)}
                        value={newmessage}

                        disabled={isLoading}
                        onFocus={() => { setinputDiv(true) }}
                        onBlur={() => { setinputDiv(false) }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}></textarea>
                    <button onClick={sendMessage} disabled={!newmessage.trim() || isLoading} className='cursor-pointer' >
                        <Image src={'/sendarrow.svg'} alt='sendarrow' height={25} width={25} />
                    </button>
                </div>

            </div>
        </div >
    )
}

export default Chatbot


