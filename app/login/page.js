'use client'
// login
import React from 'react'

import { useSession, signIn, signOut } from "next-auth/react"

import Image from 'next/image'

const Page = () => {
    const { data: session } = useSession()

    return (
        <>
            <div className="login h-[90vh] bg-[#f7f7f7] w-screen  flex justify-center items-center">
                <div className='loginAndImage flex bg-white rounded-xl w-[70vw] h-[80vh] p-2
                shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300'>
                <div className="loginpage flex flex-col justify-center items-center w-[50%] h-full " id="Login-model">
                    <p className="text-2xl font-bold dark:text-black text-center">Login to Continue</p>
                    <p className="dark:text-gray-200 text-center">It will take less than two minutes</p>
                    <div className="mt-4 w-full flex flex-col  items-center ">
                        <a href="#" className="block w-[50%] cursor-default h-fit ">
                            <button onClick={() => { signIn("google") }} className="w-full text-center cursor-pointer py-2 my-3 border flex items-center justify-center border-black rounded-lg text-slate-700 bg-white hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
                                <Image width={20} height={20} objectFit='cover' src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5 mr-2" alt="Google Icon" />
                                <span className="dark:text-gray-300">Login with Google</span>
                            </button>
                        </a>

                        <a href="#" className="block w-[50%] cursor-default h-fit">
                            <button onClick={() => { signIn('github') }} className=" w-full text-center cursor-pointer py-2 my-3 border flex items-center justify-center border-black rounded-lg bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2 dark:text-black">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span className="dark:text-gray-300">Login with Github</span>
                            </button>
                        </a>
                    </div>
                </div>
                <div className='w-[50%] flex justify-center items-center h-full relative rounded-xl overflow-hidden'>
                <Image className='object-fill' src={'/loginImage.webp'} alt='login Image' fill></Image>
                </div>
                </div>
            </div>
        </>
    )
}

export default Page
