'use client'

import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader2 } from 'lucide-react'
import { docterAgent } from '../layout'
import { useRouter } from 'next/navigation'
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler'
import { apiClient } from '@/lib/api-client'
import Card from './Card'
import { useAuth } from '@clerk/nextjs'

export default function ModelSession() {
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [suggestedDocter, setSuggestedDockter] = useState<docterAgent[]>([]);
    const [selectedDocter, setSelectedDocter] = useState<docterAgent>();
    const router = useRouter();
    const { has } = useAuth();
    const paidUser = has && has({plan: "pro"})

    const onClickNext = async () => {
        setLoading(true);
        await asyncHandlerFront(
            async() => {
                const response:any = await apiClient.suggestDocter(notes);
                setSuggestedDockter(response?.data)
            }
        )
        setLoading(false);
    };


    const onStartConsultation = async() => {
        setLoading(true);
        const payload = {
            notes,
            selectedDocter,
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
    <Dialog>
        <DialogTrigger> <Button className='mt-3' disabled={!paidUser}>+ Start a Consultation</Button> </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className='text-center pb-2'>{!suggestedDocter?.length ? 'Add Baisc Details' : 'Select the docter'}</DialogTitle>
            <DialogDescription asChild>
                {
                    !suggestedDocter?.length ? 
                    <div>
                        <h2 className='pb-1.5'>Add Symptons or Any other Details</h2>
                        <Textarea onChange={(e) => setNotes(e.target.value)} placeholder='Add Detail here...' className='mt-1 h-[200px]' />
                    </div> : 
                    <div className='grid grid-cols-2 gap-5'>
                        {suggestedDocter?.map((docter) => (
                            <Card key={docter?.id} docter={docter} id={2} setSelectedDocter={() => setSelectedDocter(docter)} selectedDocter={selectedDocter} />
                        ))}
                    </div> 
                }
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose> <Button variant={'outline'}>Cancel</Button> </DialogClose>
                    { 
                        !suggestedDocter?.length ? 
                        <div className='flex items-center'>
                            <Button disabled={!notes || loading} onClick={onClickNext}> Next {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />} </Button>
                        </div> :
                        <Button disabled={loading || !selectedDocter} onClick={() => onStartConsultation()}>Start Consultation {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}</Button> 
                    }
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}