import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const page = () => {
    return (
        <div className='guide h-[93vh] md:h-[90vh] w-screen flex justify-center  bg-[#f7f7f7]'>
        <div className="md:px-6 px-2 py-10 w-[95vw] md:w-[70vw] h-[90vh] md:h-[88vh] overflow-auto no-scrollbar ">
            {/* Hero Section */}
            <section className="md:mb-12 mb-8 text-center">
                <h1 className=" text-lg md:text-4xl font-bold mb-2 md:mb-4">Welcome to Your Collaborative Editor</h1>
                <p className="text-gray-600 text-sm md:text-lg">
                    Real-time editing, AI-powered writing, and seamless teamwork — all in one place.
                </p>
            </section>

            {/* Feature Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 md:mb-16">
                {/* AI Features */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">🧠 AI Assistant</h2>
                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        <li>Chatbot available in Home and Editor pages</li>
                        <li>Ask anything — from writing help to general queries</li>
                        <li>Text actions: <strong>Improve</strong>, <strong>Make Formal</strong>, <strong>Expand</strong></li>
                        <li>Selected text is auto-modified using AI</li>
                        <li><strong>Auto Suggest</strong>: Enable to get live suggestions while typing</li>
                    </ul>
                </div>

                {/* Live Collaboration */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">👥 Real-Time Collaboration</h2>
                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        <li>Multiple users can edit the same document simultaneously</li>
                        <li>Changes are synced live using WebSockets</li>
                        <li>Chat panel for document-specific conversations</li>
                        <li>Collaborators can join via shared document ID</li>
                    </ul>
                </div>

                {/* Templates */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">📄 Templates</h2>
                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        <li>Start faster with pre-built templates</li>
                        <li>Categories: Writing, Business, Academic, Creative</li>
                        <li>Preview before using</li>
                        <li>After clicking <strong>Use</strong>, enter title and subject to create your document</li>
                    </ul>
                    <Link href="/templates" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                        Explore Templates →
                    </Link>
                </div>

                {/* Joining Documents */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">🔗 Join a Document</h2>
                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        <li>Paste a document ID to join as a collaborator</li>
                        <li>No validation yet — invalid IDs show an alert</li>
                        <li>Once joined, you can edit and chat live</li>
                    </ul>
                    <Link href="/" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                        Go to Editor →
                    </Link>
                </div>
            </section>

            {/* Getting Started */}
            <section className="text-center">
                <h2 className="text-2xl font-bold mb-4">🚀 Ready to Get Started?</h2>
                <p className="text-gray-600 mb-6">Create a document, explore templates, or join an existing one.</p>
                <div className="flex justify-center gap-4">
                    <Link href="/documents" className="px-4 md:px-6 py-2 md:py-3 md:text-base text-sm bg-blue-600 text-white rounded-md md:rounded-lg hover:bg-blue-700 transition">
                        View Your Documents
                    </Link>
                    <Link href="/templates" className="px-4 md:px-6 py-2 md:py-3 md:text-base text-sm bg-green-600 text-white rounded-md md:rounded-lg hover:bg-green-700 transition">
                        Try a Template
                    </Link>
                </div>
            </section>
        </div>
        </div>
    )
}

export default page
