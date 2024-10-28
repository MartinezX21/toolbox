import FileList from '@/components/FileList'
import { ACTIONS } from '@/lib/constants'
import React from 'react'

function MergePdfPage() {
  return (
    <FileList action={ACTIONS.merge} />
  )
}

export default MergePdfPage