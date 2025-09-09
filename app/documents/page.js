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

    useEffect(() => {
        if (session?.user?.name) {
        getdata();
    }
    }, [session]);

    const getdata = async () => {
        const data = await getallDocuments(session?.user.name);
        setmydocuments(data);
    }

    const deleteDocument = async (deleteID) => {
         await deleteSelectedDoc(deleteID);
         getdata();
    }
    
    return (
        <div className='documents h-[90vh] w-screen  px-[20vw] bg-[#f7f7f7]'>
            <div className='create flex justify-between items-center py-5 ' >
                <h1 className='text-2xl font-bold '>Documents</h1>
                <Searchbar usedFor={'collabeditor'} />
                <AddDocument buttonName={'Add Document'}/>
            </div>
            <div className='documentlist  px-2 py-2 w-[60vw] h-[75vh] rounded-xl bg-white
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300'>
                <div className='header w-full py-4 rounded-md bg-[#f7f7f7] flex font-bold'>
                    <div className='owner w-[15%]  px-2'>Owner</div>
                    <div className='title w-[35%]  px-2'>Title</div>
                    <div className='created w-[15%]  px-2'>Last modified</div>
                    <div className='collaborators w-[20%]  px-2'>Collaborators</div>
                    <div className='delete w-[15%] px-2 text-center'>Delete</div>
                </div>

                <div className='allDocuments overflow-auto no-scrollbar h-[64vh] mt-4'>
                    {mydocuments.length == 0 ? (<div className='addDocoments text-center text-lg'>No documents available yet</div>) : (
                        mydocuments.map((element) => (
                            <div key={element._id} className='documentelement w-full py-4 rounded-md border-2 hover:bg-[#f7f7f7] border-gray-300 flex mb-4'>
                               <Link className='w-[85%] flex' href={`/collabeditor/${element._id}`}><div className='owner w-[17.6%]  px-2 text-wrap break-words '>{element.creator}</div>
                                <div className='title w-[41.17%] text-wrap break-words  px-2'>{element.docname}</div>
                                <div className='created w-[17.6%] px-2'>
                                    {new Date(element.updatedAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </div>
                                <div className='collaborators w-[23.7%] flex flex-wrap px-2'>
                                    {element.collaborators ? element.collaborators.map((member) => (<div key={member} className='collabMember mb-1 mr-1 flex justify-center items-center text-gray-500 text-sm bg-gray-100 px-2 w-fit rounded-full'>{member}</div>))
                                     : <div className=''>No Collaborators</div>}
                                </div> </Link> 
                                <div className='delete w-[15%] flex justify-center items-center text-sm'><button onClick={() => {deleteDocument(element._id)} } className='px-2 py-1 flex justify-center items-center gap-1 bg-gray-100 border-2 border-gray-300 cursor-pointer rounded-md'><Image src={'/delete.svg'} alt='dlt' width={20} height={20} />Delete</button></div>

                            </div>
                        ))
                    )}


                </div>

            </div>
        </div>

    )
}

export default page
