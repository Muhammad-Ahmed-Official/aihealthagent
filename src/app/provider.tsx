'use client'

import { apiClient } from '@/lib/api-client'
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler'
import { useUser } from '@clerk/nextjs'
import React, { ReactNode, useEffect } from 'react'

export default function Provider( { children }: Readonly<{ children: ReactNode }> ) {
    const { user } = useUser();

    useEffect(() => {
        user && createNewUser();    
    }, [user]);

    
    const createNewUser = async() => {
        await asyncHandlerFront(
            async() => {
                const response:any = await apiClient.signUp();
                console.log(response.data)
            }
        )
    };

  return (
    <div>{children}</div>
  )
}
