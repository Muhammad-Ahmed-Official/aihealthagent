import { PricingTable } from '@clerk/nextjs'

export default function page() {
  return (
    <div className='px-10 md:px-24 lg:px-48'>
        <h2 className='font-bold text-3xl mb-8'>Join Subscription</h2>
      <PricingTable />
    </div>
  )
}