'use client'

import React from 'react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useSession } from 'next-auth/react';

const ChatPanel = ({ documentId }) => {
    const [newmessage, setnewmessage] = useState('')
    const [messagearray, setmessagearray] = useState([])
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const { data: session } = useSession()
    const [currentUserImage, setcurrentUserImage] = useState('')
    const [currentUser, setcurrentUser] = useState('')

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagearray]);

    useEffect(() => {
        if(session){
            setcurrentUserImage(session?.user?.image)
            setcurrentUser(session?.user?.name)
        }
    }, [session])


    // Handle incoming chat messages
    useEffect(() => {
        if (!socket) return;

        const handleChatMessage = (data) => {
            setmessagearray(prevArray => {
                const newArray = [...prevArray, data];
                return newArray;
            });
        };

        socket.on('receive-chat-message', handleChatMessage);

        const getchathistory = (data) => {
            setmessagearray(data);
        };

        socket.on('load-chat-history', getchathistory);

        return () => {
            socket.off('receive-chat-message', handleChatMessage);
            socket.off('load-chat-history', getchathistory);
        };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newmessage.trim() || !socket) return;

        // Send chat message to server
        socket.emit('send-chat-message', {
            message: newmessage,
            documentId: documentId,
            user: currentUser,
            image: currentUserImage
        });

        setnewmessage('');
    };

    return (
        <div className="chat bg-white rounded-2xl h-[89vh] w-full p-3
         shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300  ">

            <div className='messages  h-[87%] w-full  mb-3 overflow-auto no-scrollbar'>
                <h1 className='flex gap-2 text-lg mb-2 font-bold'>
                    Live chat
                    <Image src={"/livechat.svg"} alt='livechat' height={20} width={20} /></h1>

                {messagearray.length === 0 ? <p className="text-gray-500 ">No messages yet. Start chatting!</p> : messagearray.map((msg, index) => (
                    <div key={index} className='message mb-4 h-fit w-full rounded-md border-2 border-gray-300 p-2 '>
                        <div className='info flex justify-between items-center text-gray-400 text-sm'>
                            <div className='name-photo flex items-center gap-2'>
                                <Image className='rounded-full border border-gray-300  ' src={msg.image ? msg.image : '/profile.svg'} height={30} width={30} alt='userprofile' />
                                <div className='w-fit'>{msg.user}</div>
                            </div>
                            <div className='minutes ago text-xs'>{new Date(msg.timestamp).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}</div>
                        </div>
                        <div className='msgcontent rounded-md p-1 bg-[#f7f7f7] mt-2 ml-9 w-[88%] h-fit px-2 text-sm'>{msg.message}</div>
                    </div>
                ))}
                {/* The <div ref={messagesEndRef} /> is an empty, invisible element that serves as the target for the scrolling. */}
                <div ref={messagesEndRef} />

            </div>
            <div className='sendmessage border-2 flex justify-between items-center border-gray-300 rounded-md p-2 h-[12%] w-full'>
                <textarea value={newmessage} onChange={(e) => setnewmessage(e.target.value)} placeholder='Write your message' className=' h-full w-[13vw] focus:outline-none resize-none overflow-auto no-scrollbar text-sm '  ></textarea>
                <button onClick={sendMessage} className='bg-black text-white h-fit py-3 px-5 rounded-3xl text-sm flex justify-center items-center gap-2 cursor-pointer'>
                    <Image src={"/sendbtn.svg"} alt='send btn' height={20} width={20} />
                    Send</button>
            </div>
        </div>


    )
}

export default ChatPanel
