import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react'
import { docterAgent } from '../layout';

type CardProps = {
  docter: docterAgent;
  id: number
  setSelectedDocter?:any,
  selectedDocter?: docterAgent,
}

export default function Card({docter, id, setSelectedDocter, selectedDocter}: CardProps) {
  return (
      id == 1 ? 
      <div>
        <Image src={docter.image} alt='pic' width={200} height={300} className='w-full h-[250px] object-cover rounded-2xl' />
        <h2 className='font-bold mt-1'>{docter.specialist}</h2>
        <p className='line-clamp-2 text-sm text-gray-500'>{docter.description}</p>
        <Button className='w-full mt-2'>Start Consultation <IconArrowRight/> </Button>
      </div> :
      <div onClick={() => setSelectedDocter(docter)} className={`flex flex-col items-center justify-between border rounded-2xl shadow px-4 py-8 hover:border-blue-500 cursor-pointer ${selectedDocter?.id === docter.id && 'border-blue-500'}`}>
        <Image src={docter?.image} alt='pic' width={70} height={70} className='w-[50px] h-[50px] object-cover rounded-4xl' />
        <h2 className='font-bold text-sm text-center'>{docter.specialist}</h2>
        <p className='line-clamp-2 text-xs text-center'>{docter.description}</p>
      </div>
  )
}
