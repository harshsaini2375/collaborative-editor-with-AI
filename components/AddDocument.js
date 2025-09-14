'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { CreateNewDocument } from '@/actions/useractions'
import { useRouter } from 'next/navigation'

const AddDocument = ({templateContent, buttonName}) => {
    const { data: session, update } = useSession()
    const router = useRouter();

    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        sessionName: '',
        sessionEmail: ''
    })

    useEffect(() => {
        if(session?.user?.name && session?.user?.email){
            setFormData({ title: '', description: '', category: '', sessionName: session.user.name, sessionEmail: session.user.email })
        }
    }, [session])

    // this will run in case if we already get session, and there is no session change in future
    useEffect(() => {
        if(session?.user?.name && session?.user?.email){
            setFormData({ title: '', description: '', category: '', sessionName: session.user.name, sessionEmail: session.user.email })
        }
    }, [])
    

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log('Creating document with:', formData)
        // mongodb logic
        const newDocID =  await CreateNewDocument(formData, templateContent);
        setShowForm(false)
        setFormData({ title: '', description: '', category: '' })
        // this refresh session so, data in homepage get up to date
        // await update();
        router.push(`/collabeditor/${newDocID}`);
        
    }

    return (
        <div>
            <button  onClick={() => setShowForm(true)} className=' px-1 py-[6px] md:px-4 md:py-2 cursor-pointer rounded-md md:text-base text-xs md:rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 text-white'>{buttonName}</button>


            {showForm && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-[90vw] max-w-md p-6 relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            &times;
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Create New Document</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 cursor-pointer text-white py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Create Document
                            </button>
                        </form>
                    </div>
                </div>
                
            )}
        </div>
    )
}

export default AddDocument
