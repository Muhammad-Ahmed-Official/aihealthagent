'use client'

import { apiClient } from '@/lib/api-client';
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { docterAgent } from '../../layout';
import { Circle, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type sessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: string,
  selectedDocter: docterAgent,
  createdOn: string,
}

export default function page() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<sessionDetail>();

  useEffect(() => {
    sessionId && getSessionDetail();
  }, [sessionId])

  const getSessionDetail = async() => {
    await asyncHandlerFront(
      async() => {
        const response:any = await apiClient.sessionDetail(sessionId as string);
        setSessionDetail(response.data);
      }
    )
  };

  return (
    <div className='p-5 border rounded-3xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'> <Circle className='h-4 w-4' /> Not Connected </h2>
        <h2 className='font-bold text-xl text-gray-400 '>00:00</h2>
      </div>
      {sessionDetail?.selectedDocter?.image && 
        <div className='flex items-center flex-col mt-10 '>
          <Image className='h-[120px] w-[120px] object-cover rounded-full' src={sessionDetail?.selectedDocter?.image} alt={sessionDetail?.selectedDocter?.specialist} width={120} height={120} />
          <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDocter.specialist}</h2>
          <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>
          <div className='mt-24'>
            <h2 className='text-gray-400'>Assistant Msg</h2>
            <h2 className=''>User Msg</h2>
          </div>
          <Button className='mt-20'> <PhoneCall /> Start Call</Button>
        </div> 
      }
    </div>
  )
}
