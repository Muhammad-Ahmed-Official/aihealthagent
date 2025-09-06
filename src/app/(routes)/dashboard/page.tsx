import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DocterAgentList from './_components/DocterAgentList'
import ModelSession from './_components/ModelSession'

export default function Workspace() {
  return (
    <div>
        <div className='flex justify-between items-center gap-4'>
            <h2 className='font-bold text-2xl'>My Dashaboard</h2>
           <ModelSession />
        </div>
        <HistoryList />
        <DocterAgentList />
    </div>
  )
}
