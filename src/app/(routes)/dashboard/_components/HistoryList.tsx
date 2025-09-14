'use client'

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import ModelSession from './ModelSession';
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import { apiClient } from '@/lib/api-client';
import Tables from './Tables';

export default function HistoryList() {
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
      getHistoryList()
    }, [])

    const getHistoryList = async() => {
      await asyncHandlerFront(
        async() => {
          const result:any = await apiClient.UserHistoryDetail();
          setHistoryList(result?.data);
        }
      )
    }

  return (
    <div className='mt-6'>
        { 
            historyList.length == 0 ?
            <div className='flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl'> 
                <Image src={'/medical-assistance.png'} alt='' width={150} height={150} /> 
                <h2 className='font-black text-xl '>No Recent Consultations</h2> 
                <p>It look like you haven't consulted with any docter yet</p>
                <ModelSession />
            </div> : 
            <div>
              <Tables />
            </div> 
        }
    </div>
  )
};