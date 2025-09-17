import Image from 'next/image'
import React from 'react'
import logo from "../../../../../public/logo.png"
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const menuOption = [
    {
        id: 1,
        name: "Home",
        path: "/dashboard"
    },
    {
        id: 2,
        name: "History",
        path: "/dashboard/history"
    },
    {
        id: 3,
        name: "Pricing",
        path: "/dashboard/billing"
    },
]

export default function AppHeader() {
  return (
    <div className='flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40'>
        <Image style={{height: "auto", width: "auto"}} src={logo} alt="logo" height={30} width={30} />
        <div className="hidden md:flex gap-8 items-center">
        {menuOption.map((option, index) => (
            <Link href={option?.path} key={index} className="group relative">
            <h2 className="cursor-pointer transition-all relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 group-hover:after:w-full"> {option?.name} </h2>
            </Link>
        ))}
        </div>
        <UserButton />
    </div>
  )
}
