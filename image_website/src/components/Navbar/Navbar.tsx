'use client'

import Link from "next/link";
import Image from "next/image";
import Intro from "@/components/Intro/Intro";

const NavBar = () => (
    <>
    <div className="absolute top-0 left-0 w-full bg-transparent">
        <nav className='flex items-center justify-between p-4'>
         <div className="flex items-center">
             <Link href='/' className='flex justify-center items-center'>
             <Image
                 src='/logo/logo.png'
                 alt='logo'
                 width={70}
                 height={70}
                 />
             </Link>
             <div className="m-3.5">
                 <p className="font-mono text-3xl italic font-black text-yellow-600">
                    Lumionix
                 </p>
             </div>
         </div>
         <div>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-7 h-7"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
         </div>
     </nav>
    </div>

    <header 
        className="relative z-9 flex justify-center items-center w-full"
        style={{minHeight:'500px'}}
        >
        <Intro/>
        <Image
            src='/images/banner_green.jpg'
            alt='banner'
            loading="lazy"
            fill
            className="absolute -z-10 top-0 left-0" 
        />
   </header>
    </>
);

export default NavBar;


