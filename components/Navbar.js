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
  const [userinfo, setuserinfo] = useState(false)

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
    <div className='h-[7vh] md:h-[10vh] w-screen flex gap-2 md:gap-6 justify-end md:justify-between items-center px-2 md:px-6 bg-[#f7f7f7]'>
      <div className='welcomeHeading hidden h-full w-[25%] md:flex flex-col justify-center pt-2 '>
        <span className="text-lg">Welcome back {session?.user.name && session.user.name.charAt().toUpperCase()+session.user.name.slice(1).toLowerCase()}</span>
        <span className="text-sm text-gray-400">{currentDate}</span>
      </div>
      <div className='navbar  bg-[#626c66]  md:px-10 text-white h-[5vh] md:h-[7vh] w-[77%] md:w-[50%] rounded-md  flex justify-around items-center text-sm md:text-base  '>
        <Link href={session?'/':'/login'} className='' >Home</Link>
        <Link href={session?'/documents':'/login'} className='' >Documents</Link>
        <Link href={session?'/templates':'/login'} className='' >Templates</Link>
        <Link href={session?'/projectguide':'/login'} className='' >Guide</Link>
      </div>
      {console.log('session')
      }
      {console.log(session)
      }
      <div className="profile h-full w-[10%] md:w-[25%] ">
        {session &&  <div className='h-full w-full flex justify-end items-center gap-3 '>

          <div  className={`${!userinfo && 'hidden'}  w-fit md:w-full top-[45px] md:flex-row flex-col-reverse md:flex md:justify-end md:items-center gap-1 p-2 md:p-0 md:gap-3 md:static fixed md:bg-[#f7f7f7] bg-[#626c66] z-20 rounded-md md:rounded-none `}><button onClick={() => { signOut() }} className='bg-white rounded-[4px] md:rounded-md px-4 py-1 cursor-pointer text-xs md:text-base text-gray-400 md:mr-2 border-2 md:border-none border-gray-200 w-fit '>Logout</button>
          <div className='h-fit w-fit md:text-base text-sm text-white md:text-gray-400 md:mt-0 mt-1'>{session?.user.name}</div>
          <div className='h-fit w-fit md:text-base text-xs text-white md:text-gray-400 md:hidden'>{session?.user.email}</div>
          </div>

          {/* for toggling of info in mobile */}
          <button  onClick={()=>{setuserinfo(!userinfo)}} className='h-fit w-fit cursor-pointer'>
          <Image className='rounded-full border border-gray-300 md:hidden' src={session?.user.image ? session?.user.image : '/profile.svg'} height={40} width={40} alt='userprofile' /></button>

          <Image className='rounded-full border border-gray-300 hidden md:block ' src={session?.user.image ? session?.user.image : '/profile.svg'} height={40} width={40} alt='userprofile' />
        </div>}
      </div>

    </div>
  )
}

export default Navbar
