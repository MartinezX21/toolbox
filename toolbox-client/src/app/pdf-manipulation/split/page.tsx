import PdfManipulationStudio from '@/components/PdfManipulationStudio'
import { ACTIONS } from '@/lib/constants'
import React from 'react'

function SplitPdfPage() {
  return (
    <div className='w-full h-full p-2 sm:p-10'>
      <PdfManipulationStudio action={ACTIONS.split}/>
    </div>
  )
}

export default SplitPdfPage