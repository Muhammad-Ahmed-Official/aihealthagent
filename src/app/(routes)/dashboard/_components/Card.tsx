'use client'

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react'
import { docterAgent } from '../layout';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@clerk/nextjs';
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

type CardProps = {
  docter: docterAgent;
  id: number
  setSelectedDocter?:any,
  selectedDocter?: docterAgent,
}

export default function Card({docter, id, setSelectedDocter, selectedDocter}: CardProps) {
  const { has } = useAuth();
  const paidUser = has && has({plan: "pro"});
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onStartConsultation = async() => {
    setLoading(true);
    const payload = {
        notes: "New Query",
        selectedDocter: docter,
    }
    await asyncHandlerFront(
      async() => {
          const result:any = await apiClient.startConsult(payload);
          console.log(result?.data)
          if(result?.data?.sessionId){
              router.replace(`dashboard/medical-agent/${result?.data?.sessionId}`)
          }
      }
    );
    setLoading(false);
  }; 

  return (
      id == 1 ? 
      <div className='relative'>
        {docter?.subscriptionRequired && <Badge className='absolute m-2 right-0'>Premium</Badge>}
        <Image src={docter.image} alt='pic' width={200} height={300} className='w-full h-[250px] object-cover rounded-2xl' />
        <h2 className='font-bold mt-1'>{docter.specialist}</h2>
        <p className='line-clamp-2 text-sm text-gray-500'>{docter.description}</p>
        <Button className='w-full mt-2' disabled={!paidUser&&docter.subscriptionRequired} onClick={onStartConsultation}>Start Consultation {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />} </Button>
      </div> :
      <div onClick={() => setSelectedDocter(docter)} className={`flex flex-col items-center justify-between border rounded-2xl shadow px-4 py-8 hover:border-blue-500 cursor-pointer ${selectedDocter?.id === docter.id && 'border-blue-500'}`}>
        <Image src={docter?.image} alt='pic' width={70} height={70} className='w-[50px] h-[50px] object-cover rounded-4xl' />
        <h2 className='font-bold text-sm text-center'>{docter.specialist}</h2>
        <p className='line-clamp-2 text-xs text-center'>{docter.description}</p>
      </div>
  )
}
