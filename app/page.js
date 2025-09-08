"use client"
import Chatbot from '@/components/Chatbot';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import { getallDocuments, getDocumentWithID } from '@/actions/useractions'
import Link from 'next/link';
import AddDocument from '@/components/AddDocument';

export default function Home() {

  const router = useRouter();
  const { data: session } = useSession()

  const [mydocuments, setmydocuments] = useState([]);
  const [joinLink, setJoinLink] = useState('')

  useEffect(() => {
    if (session?.user?.name) {
      getdata();
    }
  }, [session]);

  const getdata = async () => {
    const data = await getallDocuments(session?.user.name);
    setmydocuments(data);
  }

  const handleJoinLink = async (e) => {
     e.preventDefault();
    const result = await getDocumentWithID(joinLink);

    if (result) {
      router.push(`/collabeditor/${joinLink}`)
    } else {
      alert('Enter valid Document Link');
    }

  }


  return (
    <div className='home h-[90vh] w-screen px-5 gap-5 flex bg-[#f7f7f7]'>
      <div className="left h-full w-[25%]  ">
        <Chatbot documentId={"doc-2"} />
      </div>

      <div className='mainhome  w-[75%] px-[5vw] bg-white rounded-2xl h-[89vh]
         shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300  '>

        <div className='intro w-full h-[35vh] flex flex-col items-center justify-center'>
          <h1 className='text-4xl '>Collaborative Editing Supercharged with AI</h1>
          <p className='text-lg my-5 w-[40vw] text-center' >Create, edit, and collaborate on documents in real-time with AI-powered writing assistance. The modern way to write together.</p>
          <div className='AddAndJoin w-[38vw] flex gap-2 justify-between items-center'>
            <AddDocument />
            <div className='joinDocument w-[25vw]'>
              <form onSubmit={handleJoinLink} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste document link here"
                  value={joinLink}
                  onChange={(e) => setJoinLink(e.target.value)}
                  className="flex-1 px-3  border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-7 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 transition"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className='recently visited  px-5 h-fit w-full'>
          <div className='flex gap-2  items-center  text-gray-400'><Image src={'/recent.svg'} alt='recent' height={20} width={20} />Recently visited</div>

          <div className='yourDocuments my-5 w-full h-[19vh] flex gap-5 overflow-auto no-scrollbar'>

            {mydocuments.length == 0 ? (<div className='text-gray-400'>No documents available yet</div>) :
              mydocuments.map((element) => (
                <Link key={element._id} href={`/collabeditor/${element._id}`}><div className='currDoc flex-none relative overflow-hidden h-[18vh] bg-[#f7f7f7] w-[9vw] border-2 border-gray-200 rounded-2xl '>
                  <Image className='absolute top-6 left-3 z-10 ' src={'/document.svg'} alt='recent' height={27} width={27} />
                  <div className='absolute bottom-0 bg-white h-[70%] w-full px-4 py-2 flex items-end'><div className='text-sm font-semibold w-full h-[7vh] overflow-hidden'>{element.docname}</div></div>
                </div></Link>
              ))
            }
          </div>
        </div>

      </div>

    </div>

  );
}
