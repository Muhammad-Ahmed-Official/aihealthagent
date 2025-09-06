'use client'

import { apiClient } from '@/lib/api-client'
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler'
import { useUser } from '@clerk/nextjs'
import React, { ReactNode, useEffect, useState } from 'react'
import { userContext } from '@/context/userContext'
import { User } from './layout'

export default function Provider( { children }: Readonly<{ children: ReactNode }> ) {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState<User>();

    useEffect(() => {
        user && createNewUser();    
    }, [user]);

    
    const createNewUser = async() => {
        await asyncHandlerFront(
            async() => {
                const response:any = await apiClient.signUp();
                console.log(response.data)
                setUserDetail(response.data)
            }
        )
    };

  return (
      <div>
        <userContext.Provider value={{userDetail, setUserDetail}}>
            {children}
        </userContext.Provider>    
    </div>
  )
}
