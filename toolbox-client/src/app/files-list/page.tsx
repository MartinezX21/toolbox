import CallToActionDonate from '@/components/CallToActionDonate'
import FileList from '@/components/FileList'
import React from 'react'

function FileListPage({ 
  searchParams 
}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const action = searchParams['a'] as string

  return (
    <>
      <FileList action={action} />
      {!action && <CallToActionDonate />}
    </>
  )
}

export default FileListPage