'use client'

import { apiClient } from '@/lib/api-client';
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { docterAgent } from '../../layout';
import { Circle, Loader2, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';

export type Report = {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  recommandations: string[];
};

export type sessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: Report,
  selectedDocter: docterAgent,
  createdOn: string,
  voiceId?: string,
};

type message = {
  role: string,
  text: string,
}

export default function page() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<sessionDetail>();
  const [callStarted, setCallStarted] = useState<boolean>(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRoll, setCurrentRoll] = useState<string|null>('');
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [message, setMessage] = useState<message[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const router = useRouter();
  
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


  const startCall = () => {
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

  const vapiAgentConfig = {
    name: "AI Medical Doctor Voice Agent",
    firstMessage: "Hi there! I'm your AI Medical Assistance. I'm here to help you with any health questions or concerns you might have today. How are you feeling?",
    transcriber: {
      provider: "assembly-ai",
      language: "en",
    },
    voice: {
      provider: "vapi",
      voiceId: sessionDetail?.selectedDocter?.voiceId,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: sessionDetail?.selectedDocter?.agentPrompt,
        },
      ],
    },
  };

  vapi.start(vapiAgentConfig as any);

  vapi.on('call-start', () => {
    console.log('Call started');
    setCallStarted(true);
  });
  vapi.on('call-end', () => {
    console.log('Call ended');
    setCallStarted(false);
  });
  vapi.on('message', (message) => {
    if (message.type === 'transcript') {
      const { role, transcriptType, transcript } = message;
      console.log(`${message.role}: ${message.transcript}`);
      if (transcriptType === 'partial') {
        setLiveTranscript(transcript);
        setCurrentRoll(role);
      } else if (transcriptType === 'final') {
        setMessage((prev: any) => [...prev, { role: role, text: transcript }]);
        setLiveTranscript("");
        setCurrentRoll(null);
      }
    }
  });

  vapi.on('speech-start', () => {
    console.log('Assistant started speaking');
    setCurrentRoll('assistant');
  });
  vapi.on('speech-end', () => {
    console.log('Assistant stopped speaking');
    setCurrentRoll('user');
  });

  setVapiInstance(vapi);
  };


  const generateReport = async() => {
  return await asyncHandlerFront(
    async() => {
      const payload = { messages:message, sessionDetail, sessionId };
      const result:any = await apiClient.generateMedicalReport(payload);
      return result.data;
    }
  );
};

const endCall = async () => {
  if (!vapiInstance) return;

  vapiInstance.stop();
  vapiInstance.removeAllListeners?.();

  setCallStarted(false);
  setVapiInstance(null);

  setLoadingReport(true);

  await generateReport();
  setLoadingReport(false);
  toast.success("Report generated successfully");

  router.replace('/dashboard');
};


  return (
    <div className='p-5 border rounded-3xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'> <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />{callStarted ? "Connected..." :  "Not Connected"} </h2>
        <h2 className='font-bold text-xl text-gray-400 '>00:00</h2>
      </div>
      {sessionDetail?.selectedDocter?.image && 
        <div className='flex items-center flex-col mt-10 '>
          <Image className='h-[120px] w-[120px] object-cover rounded-full' src={sessionDetail?.selectedDocter?.image} alt={sessionDetail?.selectedDocter?.specialist} width={120} height={120} />
          <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDocter.specialist}</h2>
          <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>
          <div className='mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72'>
            {
              message?.slice(-4)?.map((msg:message, index:number) => (
                <h2 key={index} className='text-gray-400 p-2'>{msg?.role} : {msg.text}</h2>
              ))
            }
            {liveTranscript && liveTranscript?.length > 0 && <h2 className='text-lg'>{currentRoll} : {liveTranscript}</h2>}
          </div>
          {!callStarted ? <Button className='mt-20' onClick={startCall} > <PhoneCall /> Start Call</Button> : <Button onClick={endCall} variant={'destructive'} className='mt-20' disabled={loadingReport}>{loadingReport ? ( <> <Loader2 className='animate-spin' /> Generating Report... </> ) :  (<><PhoneOff /> End Call</>)}</Button>}
        </div> 
      }
    </div>
  )
}