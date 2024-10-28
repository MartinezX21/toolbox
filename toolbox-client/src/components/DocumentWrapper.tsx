import React, { ReactNode } from 'react'

function DocumentWrapper({ children }: { children: ReactNode }) {
  return (
    <div className='place-self-center'>
        {children}
    </div>
  )
}

export default DocumentWrapper