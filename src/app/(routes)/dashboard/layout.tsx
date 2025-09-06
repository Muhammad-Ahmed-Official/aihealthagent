import React, { ReactNode } from 'react'
import AppHeader from './_components/AppHeader'

export type docterAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
  }

export default function dashboardLayout({ children} : Readonly<{children:ReactNode}>) {

  return (
    <div>
        <AppHeader /> 
        <div className='px-10 md:px-20 lg:px-40 py-5'> {children} </div>  
    </div>
  )
}
