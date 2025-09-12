"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { getallDocuments, deleteSelectedDoc } from '@/actions/useractions'
import AddDocument from '@/components/AddDocument'
import Searchbar from '@/components/Searchbar'

const page = () => {

    const { data: session } = useSession()

    const [mydocuments, setmydocuments] = useState([]);
    const [showDeletePopup, setshowDeletePopup] = useState('')

    useEffect(() => {
        if (session?.user?.name) {
            getdata();
        }
    }, [session]);

    const getdata = async () => {
        const data = await getallDocuments(session?.user.name);
        setmydocuments(data);
    }

    const deleteDocument = async () => {
        await deleteSelectedDoc(showDeletePopup);
        setshowDeletePopup('');
        getdata();
    }

    return (
        <div className='documents h-[93vh] md:h-[90vh] w-screen  px-2 md:px-[20vw] bg-[#f7f7f7]'>
            <div className='create flex justify-between items-center pt-1 pb-3 md:py-5 ' >
                <h1 className='text-2xl font-bold hidden md:block '>Documents</h1>
                <Searchbar usedFor={'collabeditor'} />
                <AddDocument buttonName={'Add  Document'} />
            </div>
            <div className='documentlist  px-2 py-2 w-full md:w-[60vw] h-[85vh] md:h-[75vh] rounded-xl bg-white
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300'>

                {/* Delete Confirmation Modal */}
                {showDeletePopup != '' &&  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm ">
                    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6 w-[95vw] md:w-full max-w-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this document? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                onClick={()=>{setshowDeletePopup('')}}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={()=>{deleteDocument()}}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>}
               

                <div className='header w-full py-3 md:py-4 rounded-md bg-[#f7f7f7] md:text-base text-sm flex font-bold'>
                    <div className='owner w-[30%] md:w-[15%]  px-2'>Owner</div>
                    <div className='title w-[30%] md:w-[35%]  px-2'>Title</div>
                    <div className='created w-[30%] md:w-[15%]  px-2'>modified on</div>
                    <div className='collaborators hidden md:block w-[20%]  px-2'>Collaborators</div>
                    <div className='delete w-[10%] md:w-[15%] px-2 text-center'><span className='md:block hidden '>Delete</span></div>
                </div>

                <div className='allDocuments overflow-auto no-scrollbar h-[73vh] md:h-[64vh] mt-4'>
                    {mydocuments.length == 0 ? (<div className='addDocoments text-center text-base md :text-lg'>No documents available yet</div>) : (
                        mydocuments.map((element) => (
                            <div key={element._id} className='documentelement w-full py-3 md:py-4 text-sm md:text-base rounded-md border-2 hover:bg-[#f7f7f7] border-gray-300 flex mb-4'>
                                <Link className='md:w-[85%] w-[90%] flex' href={`/collabeditor/${element._id}`}><div className='owner w-[33%] md:w-[17.6%]  px-2 text-wrap break-words '>{element.creator}</div>
                                    <div className='title w-[33%] md:w-[41.17%] text-wrap break-words  px-2'>{element.docname}</div>
                                    <div className='created w-[33%] md:w-[17.6%] px-2'>
                                        {new Date(element.updatedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className='collaborators hidden  w-[23.7%] md:flex flex-wrap px-2'>
                                        {element.collaborators ? element.collaborators.map((member) => (<div key={member} className='collabMember mb-1 mr-1 flex justify-center items-center text-gray-500 text-sm bg-gray-100 px-2 w-fit rounded-full'>{member}</div>))
                                            : <div className=''>No Collaborators</div>}
                                    </div> </Link>
                                <div className='delete w-[10%] md:w-[15%] flex justify-center items-center text-sm'><button onClick={() => { setshowDeletePopup(element._id) }} className='md:px-2 md:py-1 flex justify-center items-center gap-1 md:bg-gray-100 md:border-2 md:border-gray-300 cursor-pointer rounded-md'><Image src={'/delete.svg'} alt='dlt' width={20} height={20} /><span className='md:block hidden '>Delete</span></button></div>

                            </div>
                        ))
                    )}


                </div>

            </div>
        </div>

    )
}

export default page
