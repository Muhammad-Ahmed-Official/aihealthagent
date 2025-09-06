import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react'

type docterAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
}

type CardProps = {
  docter: docterAgent;
}

export default function Card({docter}: CardProps) {
  return (
    <div>
        <Image src={docter.image} alt='pic' width={200} height={300} className='w-full h-[250px] object-cover rounded-2xl' />
        <h2 className='font-bold mt-1'>{docter.specialist}</h2>
        <p className='line-clamp-2 text-sm text-gray-500'>{docter.description}</p>
        <Button className='w-full mt-2'>Start Consultation <IconArrowRight/> </Button>
    </div>
  )
}
