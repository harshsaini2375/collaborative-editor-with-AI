"use client"
import React from 'react'
import dynamic from 'next/dynamic';
import Chatbot from './Chatbot';

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


const Editor = ({docLink}) => {
  return (
    <div>
       <div className='home h-[90vh] w-screen px-6 gap-6 flex bg-[#f7f7f7]'>
        <div className="left h-full w-[25%]  ">
          <Chatbot documentId={docLink}/>
        </div>

        <div className="center h-full w-[50%]  ">
          <RichTextEditor documentId={docLink} />
        </div>
        <div className="right h-full w-[25%]">
          <ChatPanel documentId={docLink} />
        </div>
      </div>
   
    </div>
  )
}

export default Editor
