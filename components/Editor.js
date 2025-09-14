"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import Chatbot from './Chatbot';
import Image from 'next/image';

// Dynamically import the Quill component with SSR disabled
const RichTextEditor = dynamic(
  () => import('@/components/RichTextEditor'), // Adjust the path to your component
  {
    ssr: false, // This is the key line. It disables server-side rendering for this component.
    loading: () => <p>Loading editor...</p> // Optional: Show a loading state
  }
);

const ChatPanel = dynamic(
  () => import('@/components/ChatPanel'),
  { ssr: false, loading: () => <p>Loading chat...</p> }
);


const Editor = ({ docLink }) => {
  const [openchatpanel, setopenchatpanel] = useState(false)
  const [openAIpanel, setopenAIpanel] = useState(false)
  return (
    <div>
      <div className='home h-[93vh] md:h-[90vh] w-screen px-2 md:px-6 gap-6 flex bg-[#f7f7f7]'>
        {/* responsiveness for AI */}
        <button  onClick={() => setopenAIpanel(!openAIpanel)} className= {`md:hidden ${openAIpanel ? 'hidden' : 'fixed'} top-[145vw] cursor-pointer left-[85vw] z-70 `} >
        <div className='h-[30px] w-[31px] rounded-full border flex justify-center items-center shadow-lg '> <Image src={'/aislider.svg'} alt='ham' height={20} width={20} /> </div>
        </button>

        <button  onClick={() => setopenAIpanel(false)}  className={`md:hidden fixed top-[22px] left-[85vw] z-70 transition-all duration-300 ease-in-out 
    ${openAIpanel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`} >
        <Image src={'/cross.svg'} alt='ham' height={25} width={25} />
        </button>

        

        <div className={`fixed bottom-0 left-0 w-full h-screen bg-white z-60 transition-transform duration-300 ease-in-out md:hidden 
        ${openAIpanel ? 'translate-y-0' : 'translate-y-full'}`}>
           <Chatbot documentId={docLink} />
        </div>


        <div className="left h-full hidden md:block  w-[25%]  ">
          <Chatbot documentId={docLink} />
        </div>

        
        <div className="center  h-full w-screen md:w-[50%]  ">
          <RichTextEditor documentId={docLink} />
        </div>


      {/* for chatpanel */}
      {/* hamburger for mobile for chatbot */}
        <button  onClick={() => setopenchatpanel(!openchatpanel)} className=" md:hidden fixed top-[10px] left-[9px] z-50  ">
          {openchatpanel ? <Image src={'/cross.svg'} alt='ham' height={25} width={25} /> : <Image src={'/sidechat.svg'} alt='ham' height={25} width={25} />} 
        </button>

        <div className={`fixed  top-0 left-0 h-full w-[87vw] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          openchatpanel ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <ChatPanel documentId={docLink} />
        </div>

      {/* only visible in desktop */}
         <div className="right h-full hidden md:block  w-[25%]  ">
          <ChatPanel documentId={docLink} />
        </div>
      </div>

    </div>
  )
}

export default Editor
