import React from 'react'
import { AIDoctorAgents } from '../../../../../shared/list'
import Card from './Card'

export default function DocterAgentList() {
  return (
    <div className='mt-6'>
        <h2 className='font-bold text-xl'>AI Specialist Docter Agent</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-4'>
            {AIDoctorAgents.map((docter) => (
                <div key={docter?.id}>
                    <Card docter={docter} />
                </div>
            ))}
        </div>
    </div>
  )
}
