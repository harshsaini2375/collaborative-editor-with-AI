'use client'; // This is crucial! It marks this component as Client-Side only.

import React from 'react'
import html2pdf from 'html2pdf.js';
import { useRef, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import the styles
import { useSocket } from '@/context/SocketContext';
import Image from 'next/image';
import { useSession } from "next-auth/react"
import { getDocumentWithID } from '@/actions/useractions';


const RichTextEditor = ({ documentId }) => {

  const { data: session } = useSession()

  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isbtnloading, setisbtnloading] = useState('')

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [lastAnalyzedPosition, setLastAnalyzedPosition] = useState(0);
  const socket = useSocket();
  const [autoSuggestToggle, setautoSuggestToggle] = useState(false)


  let saveInterval;
  let aiDebounce;
  let currentRequestId = 0;

  const toolbarOptions = [
    // 1. The Absolute Basics (Most Used)
    ['bold', 'italic', 'underline'],

    // 2. Fonts & Text Size
    [{ 'font': [] }], // Default font list
    // [{ 'size': ['small', false, 'large', 'huge'] }], // Custom sizes

    // 3. Colors
    [{ 'color': [] }, { 'background': [] }], // Text color & background

    // 4. Structure & Organization
    [{ 'header': [2, 3, 4, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['blockquote'],

    // 5. Collaboration & Connectivity
    ['image'],

    // 6. Cleanup
    ['clean']
  ];


  useEffect(() => {
    // This useEffect only runs in the browser
    if (editorRef.current && !quillInstanceRef.current) {
      // Initialize Quill only once
      quillInstanceRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        },
        placeholder: 'Start collaborating...',
      });

    }
  }, []);



  const handleDownload = async () => {
    // there is a div having class '.ql-editor' automatically created by quill
    const element = document.querySelector('.ql-editor');
    const docObj = await getDocumentWithID(documentId);

    const opt = {
      margin: 10,
      filename: docObj.docname,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };


  // fuction that runs when one clicks on AI button in toolbar after selection of some text
  const handleAIChat = async (operation) => {
    try {
      // Get the currently selected text from Quill
      const quill = quillInstanceRef.current;

      if (!quill) {
        alert('Editor not ready. Please try again.');
        return;
      }

      const selection = quill.getSelection();

      if (!selection || selection.length === 0) {
        alert('Please select some text first');
        return;
      }

      const selectedText = quill.getText(selection.index, selection.length);

      // Show loading state
      setisbtnloading(operation)

      // Call your AI API
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: selectedText,
          operation: operation // 'improve', 'shorten', 'expand', etc.
        })
      });

      const data = await response.json();

      // Check if we got a valid response
      if (!data || !data.response) {
        throw new Error('No response received from AI service');
      }

      // Replace the selected text with AI's suggestion
      quill.deleteText(selection.index, selection.length);
      quill.insertText(selection.index, data.response);

    } catch (error) {
      console.error('Error:', error);
      alert('AI request failed. Please try again.');
    } finally {
      setisbtnloading('')
    }
  };


  // Effect to handle socket events
  useEffect(() => {
    if (socket == null || quillInstanceRef.current == null) return;

    if (session) {
      // 1. Join the document room when component mounts
      socket.emit('join-document', documentId, session?.user.name, session?.user.email);
    }


    // give old content to new user when it join
    const loadHandler = (documentContent) => {
      console.log('Loading document content:', documentContent);
      // Check if the content is not empty
      if (documentContent && documentContent.ops) {
        // Set the entire editor content to what was received from the server
        quillInstanceRef.current.setContents(documentContent);
      }
    };
    socket.on('load-document', loadHandler);

    // 2. Handle incoming changes from other users
    const handler = (delta) => {
      quillInstanceRef.current.updateContents(delta);
    };
    socket.on('receive-changes', handler);

    // 3. Send changes to the server when user types
    const quill = quillInstanceRef.current;
    const textChangeHandler = (delta, oldDelta, source) => {
      if (source !== 'user') return; // Only send user-generated changes
      socket.emit('send-changes', delta, documentId);
    };
    quill.on('text-change', textChangeHandler);

    // Handler : For Saving to Database
    const saveChangeHandler = () => {
      clearTimeout(saveInterval);
      saveInterval = setTimeout(() => {
        const contents = quill.getContents();
        socket.emit('save-document', contents, documentId); // Send full content for saving
      }, 1000);
    };
    quill.on('text-change', saveChangeHandler); // Also listen for text-change

    // Cleanup on unmount
    return () => {
      socket.off('load-document', loadHandler);
      socket.off('receive-changes', handler);
      quill.off('text-change', textChangeHandler);
    };
  }, [socket, documentId, session]);

  // useeffects and functions below are for the feature of AI assistant 

  // Add this new useEffect for real-time AI suggestions
  useEffect(() => {
    if (!quillInstanceRef.current) return;

    const quill = quillInstanceRef.current;

    const textChangeHandler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      if (!autoSuggestToggle) return;

      // Clear previous debounce
      clearTimeout(aiDebounce);

      // Get current text and cursor position
      const selection = quill.getSelection();
      if (!selection) return;

      const text = quill.getText();
      const cursorPosition = selection.index;

      // Get the current line or paragraph
      const lines = text.split('\n');
      let currentLine = '';
      let lineStartIndex = 0;
      let lineNumber = 0;

      for (let i = 0; i < lines.length; i++) {
        if (lineStartIndex + lines[i].length + 1 > cursorPosition) {
          currentLine = lines[i];
          lineNumber = i;
          break;
        }
        lineStartIndex += lines[i].length + 1;
      }

      // Only make API call if we have substantial text and user paused typing
      if (currentLine.length > 5) {
        aiDebounce = setTimeout(() => {
          // Generate a unique ID for this request
          const requestId = ++currentRequestId;
          getAISuggestions(currentLine, cursorPosition - lineStartIndex, lineNumber, lineStartIndex, requestId);
        }, 1500); // Increased debounce to 1.5 seconds
      }
    };


    quill.on('text-change', textChangeHandler);


    return () => {
      quill.off('text-change', textChangeHandler);
      clearTimeout(aiDebounce);
    };
  }, [autoSuggestToggle]);

  // Enhanced function to get AI suggestions with context tracking
  const getAISuggestions = async (text, cursorPositionInLine, lineNumber, lineStartIndex, requestId) => {
    if (requestId !== currentRequestId) {
      console.log('Ignoring stale AI request');
      return;
    }

    try {
      setIsAILoading(true);
      setLastAnalyzedText(text);
      setLastAnalyzedPosition(lineStartIndex + cursorPositionInLine);

      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          cursorPosition: cursorPositionInLine,
          documentId,
          context: { lineNumber, lineStartIndex }
        })
      });

      const data = await response.json();

      if (requestId !== currentRequestId) {
        console.log('Ignoring stale AI response');
        return;
      }

      if (data.suggestions && data.suggestions.length > 0) {
        setAiSuggestions(data.suggestions);

        const quill = quillInstanceRef.current;
        const selection = quill.getSelection();

        if (selection) {
          const bounds = quill.getBounds(selection.index);
          const editorRect = editorRef.current.getBoundingClientRect();

          setSuggestionPosition({
            top: editorRect.top + bounds.top + bounds.height + window.scrollY,
            left: editorRect.left + bounds.left + window.scrollX
          });

          setShowSuggestions(true);
        }
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      // Show user-friendly error message
      setAiSuggestions(['AI service is busy. Please try again in a moment.']);
      setShowSuggestions(true);
    } finally {
      if (requestId === currentRequestId) {
        setIsAILoading(false);
      }
    }
  };

  // Enhanced function to apply a suggestion with context verification
  const applySuggestion = (suggestion) => {
    const quill = quillInstanceRef.current;
    const currentText = quill.getText();

    // Find the line that was originally analyzed
    const lines = currentText.split('\n');
    let currentLineStartIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineEndIndex = currentLineStartIndex + lines[i].length;

      // Check if this is approximately where we were analyzing
      if (Math.abs(currentLineStartIndex - lastAnalyzedPosition) < 10) {
        // Found the line - replace it with the suggestion
        quill.deleteText(currentLineStartIndex, lines[i].length);
        quill.insertText(currentLineStartIndex, suggestion);
        break;
      }

      currentLineStartIndex = lineEndIndex + 1; // +1 for the newline character
    }

    setShowSuggestions(false);
  };

  // Add a function to check if the analyzed text is still relevant
  const isAnalyzedTextStillRelevant = () => {
    if (!quillInstanceRef.current) return false;

    const quill = quillInstanceRef.current;
    const currentText = quill.getText();
    const lines = currentText.split('\n');
    let currentLineStartIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (Math.abs(currentLineStartIndex - lastAnalyzedPosition) < 10) {
        // We're near the original position - check if text is similar
        return lines[i].includes(lastAnalyzedText.substring(0, 5)) ||
          lastAnalyzedText.includes(lines[i].substring(0, 5));
      }
      currentLineStartIndex += lines[i].length + 1;
    }

    return false;
  };


  return (
    <div className='relative'>
      <div className='relative'>
        <div ref={editorRef} className=' shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300 ' />

        {/* AI Suggestions Popup */}
        {showSuggestions && (
          <div
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 min-w-[200px] max-w-[300px]"
            style={{ top: `${suggestionPosition.top}px`, left: `${suggestionPosition.left}px` }}
          >
            <div className="font-semibold text-sm mb-2 text-gray-700 flex justify-between items-center">
              <span>AI Suggestions</span>
              {!isAnalyzedTextStillRelevant() && (
                <span className="text-xs text-orange-500 ml-2">⚠️ Context may have changed</span>
              )}
            </div>
            <div className="space-y-1">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
            <button
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setShowSuggestions(false)}
            >
              Dismiss
            </button>
          </div>
        )}

        {isbtnloading != '' && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-700 font-medium">AI is thinking...</span>
            </div>
          </div>
        )}


      </div>

      <div className='AI_buttons flex gap-[28px] text-sm font-bold  h-[4vh]' >
        <button
          onClick={() => handleAIChat('improve')}
          className="border-2 border-gray-300 rounded-lg px-4 py-1 hover:text-yellow-500"
          disabled={isbtnloading != ''}
        >
          <span className="mr-1">✨</span>{isbtnloading == 'improve' ? 'AI Thinking...' : 'Improve with AI'}
        </button>

        <button
          onClick={() => handleAIChat('formal')}
          className="border-2 border-gray-300 rounded-lg px-4 py-1 hover:text-[#a06cd5]"
          disabled={isbtnloading != ''}
        >
          <span className="mr-1">👔</span> {isbtnloading == 'formal' ? 'AI Thinking...' : 'Make Formal'}
        </button>

        <button
          onClick={() => handleAIChat('expand')}
          className="border-2 border-gray-300 rounded-lg px-4 py-1 hover:text-[#57a7f6]"
          disabled={isbtnloading != ''}
        >
          <span className="mr-1">⤵️</span> {isbtnloading == 'expand' ? 'AI Thinking...' : 'Expand Text'}
        </button>

        {/* <button onClick={() => {setautoSuggestToggle(!autoSuggestToggle)}} className={`border-2  rounded-lg px-4 py-1 ${autoSuggestToggle?"bg-gradient-to-r from-[#8150f2] to-[#407cf5] text-white":"border-blue-500"}`}>Auto-suggest with AI          
        </button> */}

      </div>

      <div className="get_Document_link  mt-3 h-[6vh] w-full rounded-2xl flex  gap-7 items-center  ">
        <div className='flex gap-[28px]'>
          <div className='your_link border-2 border-gray-300 w-[26.5vw] py-[5px] rounded-lg text-sm px-2 flex items-center text-gray-400 overflow-hidden whitespace-nowrap '>
            {documentId}
          </div>
          <button onClick={() => {
            navigator.clipboard.writeText(documentId);
            alert("Document ID copied to clipboard!");
          }}
            className='text-white bg-red-500 text-sm cursor-pointer rounded-md  px-3  flex items-center gap-1'><Image src={'/copy.svg'} alt='copy' width={20} height={20} />Copy</button>
        </div>
        <button
          onClick={handleDownload}
          className="pl-[14px] pr-[18px] py-[3px] cursor-pointer bg-gradient-to-r flex gap-2  from-[#8150f2] to-[#407cf5] text-white font-semibold rounded-md"
        >
          <Image src={'/download.svg'} alt='download' width={20} height={20} />
          Download PDF
        </button>
      </div>


    </div>
  )
}

export default RichTextEditor
