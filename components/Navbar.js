"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {

    if (session) {
      router.push(pathname)
    }
    console.log(pathname);
    

    if (session && pathname == '/login') {
      router.push('/')
    }
    
    if (!session) {
      router.push(`/login`)
    }

  }, [session])

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })); // Format the date
  }, []);

  return (
    <div className=' h-[10vh] w-screen flex gap-6  justify-between items-center px-6 bg-[#f7f7f7]'>
      <div className='welcomeHeading h-full w-[25%] flex flex-col justify-center pt-2 '>
        <span className="text-lg">Welcome back {session?.user.name && session.user.name.charAt().toUpperCase()+session.user.name.slice(1).toLowerCase()}</span>
        <span className="text-sm text-gray-400">{currentDate}</span>
      </div>
      <div className='navbar bg-[#626c66]  px-10 text-white h-[7vh] w-[50%] rounded-md  flex justify-around items-center '>
        <Link href={session?'/':'/login'} className='' >Home</Link>
        <Link href={session?'/documents':'/login'} className='' >Documents</Link>
        <Link href={session?'/templates':'/login'} className='' >Templates</Link>
        <Link href={session?'/projectguide':'/login'} className='' >Guide</Link>
      </div>
      {console.log('session')
      }
      {console.log(session)
      }
      <div className="profile h-full w-[25%] ">
        {session &&  <div className='h-full w-full flex justify-end items-center gap-3 '>
          <button onClick={() => { signOut() }} className='bg-white rounded-md px-4 py-1 cursor-pointer text-gray-400 mr-2'>Logout</button>
          <div className='h-fit w-fit text-gray-400'>{session?.user.name}</div>
          <Image className='rounded-full border border-gray-300' src={session?.user.image ? session?.user.image : '/profile.svg'} height={40} width={40} alt='userprofile' />
        </div>}
      </div>

    </div>
  )
}

export default Navbar
