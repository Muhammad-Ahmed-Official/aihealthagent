'use client'

import { apiClient } from '@/lib/api-client';
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function page() {
  const { sessionId } = useParams();

  // useEffect(() => {
  //   sessionId && getSessionDetail();
  // }, [sessionId])

  const getSessionDetail = async() => {
    await asyncHandlerFront(
      async() => {
        // const response = await apiClient.sessionDetail(sessionId as string)
      }
    )
  };


  return (
    <div>{sessionId}</div>
  )
}
