'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSearchData } from '@/actions/useractions';
import { useSession } from 'next-auth/react';

const Searchbar = ({ usedFor }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searchfocus, setsearchfocus] = useState(false)
    const { data: session } = useSession()

    useEffect(() => {
        if (searchQuery != '') {
            handleSearch();
        }
    }, [searchQuery])

    const handleSearch = async () => {
        const data = await getSearchData(searchQuery, session?.user?.email, usedFor);
        setResults(data);
    }

    const handleInputBlur = () => {
        setTimeout(() => {
            setSearchQuery('')
            setResults([])
            setsearchfocus(false)
        }, 500);
    }


    return (
        <div className='relative '>
            <div className='border-2 border-blue-500 bg-white h-[4vh] md:h-[5vh] w-[65vw] md:w-[30vw] rounded-lg flex gap-2 items-center px-3  '>
                <Image src={'/search.svg'} alt='search' height={28} width={28} />
                <input placeholder={`Search for a ${usedFor == 'collabeditor' ? 'document' : 'template'}`} onFocus={() => { setsearchfocus(true) }} onBlur={() => { handleInputBlur() }} type="text" value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} className='focus:outline-none border-l-2 border-l-gray-300 px-2 w-[85%] text-gray-400 '></input>
            </div>

            {searchfocus && <div className='resultsOfSearch absolute top-3 md:top-6  overflow-auto no-scrollbar bg-white showresults h-[35vh] md:h-[55vh] w-[65vw] md:w-[30vw] border-2 border-gray-200 z-50 rounded-lg mt-5 p-2 md:p-5
             shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300  '>

                {results.length == 0 ? <div className='ifNoDocFound flex flex-col mt-5 md:mt-20 items-center h-full w-full gap-1'>
                    <Image src={'/nodocument.svg'} alt='documentsearch' height={60} width={60} />
                    <h1 className='text-xl '>No documents found</h1>
                    <p className='text-gray-400'>Try adjusting your search to find what you are looking for</p>
                </div> : results.map((element) => (
                    <Link key={element._id} href={`/${usedFor}/${usedFor == 'collabeditor' ? element._id : element.id}`}> <div className='flex gap-2 mb-2 bg-[#f7f7f7] rounded-[4px] md:rounded-lg px-2 md:px-4 text-sm md:text-base py-1 md:py-2 items-center '>
                        <Image src={'/documentsearch.svg'} alt='documentsearch' height={22} width={22} />
                        {usedFor == 'collabeditor' ? element.docname : element.title}
                    </div> </Link>
                ))}

            </div>}

        </div>
    )
}

export default Searchbar
