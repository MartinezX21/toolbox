import PdfManipulationStudio from '@/components/PdfManipulationStudio'
import { ACTIONS } from '@/lib/constants'
import React from 'react'

function PdfRemovePagesPage() {
  return (
    <div className='w-full h-full p-2 sm:p-10'>
      <PdfManipulationStudio action={ACTIONS.removePages}/>
    </div>
  )
}

export default PdfRemovePagesPage