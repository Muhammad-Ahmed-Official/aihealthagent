import Image from 'next/image'
import React from 'react'
import logo from "../../../../../public/logo.png"
import { UserButton } from '@clerk/nextjs'

const menuOption = [
    {
        id: 1,
        name: "Home",
        path: "/home"
    },
    {
        id: 2,
        name: "History",
        path: "/history"
    },
    {
        id: 3,
        name: "Pricing",
        path: "/pricing"
    },
    {
        id: 4,
        name: "Profile",
        path: "/profile"
    },
]

export default function AppHeader() {
  return (
    <div className='flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40'>
        <Image src={logo} alt="logo" height={30} width={30} />
        <div className='hidden md:flex gap-8 items-center'>
            { menuOption.map((option, index) => (
                <div key={index}>
                    <h2 className='hover:font-bold cursor-pointer transition-all'>{option.name}</h2>
                </div>
            ))}
        </div>
        <UserButton />
    </div>
  )
}
