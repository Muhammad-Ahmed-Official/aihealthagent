'use client'

import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight } from 'lucide-react'
import { docterAgent } from '../layout'
import { useRouter } from 'next/navigation'
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler'
import { apiClient } from '@/lib/api-client'

export default function ModelSession() {
    const [note, setNote] = useState<string>('');
    const [suggestedDocter, setSuggestedDockter] = useState<docterAgent>();
    const [selectedDocter, setSelectedDocter] = useState<docterAgent>();
    const router = useRouter();

    const onClickNext = async () => {
        await asyncHandlerFront(
            async() => {
                // await apiClient
            }
        )
    };


    const onStartConsultation = async() => {
        await asyncHandlerFront(
            async() => {
                const result = await apiClient
                // if(result?.data?.sessionId){
                //     router.push(`/dashabord/medical-agent/${result?.data?.sessionId}`)
                // }
            }
        )
    }



  return (
    <Dialog>
        <DialogTrigger>
            <Button className='mt-3'>+ Start a Consultation</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add Baisc Details</DialogTitle>
            <DialogDescription asChild>
                <div>
                    <h2>Add Symptons or Any other Details</h2>
                    <Textarea onChange={(e) => setNote(e.target.value)} placeholder='Add Detail here...' className='mt-1 h-[200px]' />
                </div>
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose> <Button variant={'outline'}>Cancel</Button> </DialogClose>
                    <Button disabled={!note}>Next <ArrowRight /></Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}