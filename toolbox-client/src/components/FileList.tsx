'use client'

import React, { useState } from 'react'
import DocumentWrapper from './DocumentWrapper'
import { useAppDispatch, useAppSelector } from '@/hooks'
import FilePicker from './FilePicker'
import { ACTIONS, MAX_FILE_SIZE, PageLinks } from '@/lib/constants'
import { cn, getTargetActionName, getTargetUrl } from '@/lib/utils'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import DocumentItem from './DocumentItem'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Snackbar, TextField } from '@mui/material'
import { PdfDocument } from '@/lib/types'
import { addDocuments, replaceDocument } from '@/lib/state/documents/documentsSlice'
import AppAlert, { AppAlertInfo, defaultAlertInfo } from './AppAlert'
import { downloadFile } from '@/lib/rest-client'
import { mergeDocuments } from '@/services/documentService'
import { useRouter } from 'next/navigation'

type FileListProps = {
  action: string
}

function FileList(props: FileListProps) {
  const documents = useAppSelector(state => state.documents.documents)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<PdfDocument>()
  const [alertInfo, setAlertInfo] = useState<AppAlertInfo>(defaultAlertInfo)

  const isActionBtnVisible = () => {
    if(props.action === ACTIONS.merge) {
      return documents.length >= 2
    } else {
      return documents.length === 1
    }
  }

  const handleOpenDialog = (document: PdfDocument) => {
    setDialogOpen(true)
    setSelectedDocument(document)
  };

  const handleCloseDialog = (documentName?: string) => {
    if(!!selectedDocument && !!documentName) {
      const newDoc:PdfDocument = {
        ...selectedDocument,
        filename: documentName
      }
      dispatch(replaceDocument(newDoc))
    }
    setDialogOpen(false)
    setSelectedDocument(undefined)
  }

  const handleMergeDocuments = async () => {
    if(loading) {
      return
    }
    try {
      setLoading(true)
      const mergedPdf = await mergeDocuments(documents)
      dispatch(addDocuments([mergedPdf]))
      router.push(PageLinks.filesList)
    } catch (error) {
      setAlertInfo({
        type: 'error',
        visible: true,
        message: "An unexpected error occured"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadDocument = async (pdfDocument: PdfDocument) => {
    if(loading) {
      return
    }
    try {
      setLoading(true)
      const docLoaded = await downloadFile(`/files/pdf/${pdfDocument.id}`)
      const downloadUrl = window.URL.createObjectURL(new Blob([docLoaded.data], {
        type: "application/pdf"
      }))
      // create "a" element to pop up the document
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${pdfDocument.filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      // clean up "a" element
      document.body.removeChild(link);
    } catch (error) {
      setAlertInfo({
        type: 'error',
        visible: true,
        message: "An error occured when downloading the document"
      })
    } finally {
      setLoading(false)
    }
  }

  if(documents.length > 0) {
    const targetUrl = getTargetUrl(props.action)
    return (
      <div className='w-full h-full p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-5'>
        {documents.map(document => 
        <DocumentWrapper key={document.id}>
            <DocumentItem 
              document={document} 
              showAdditionalActions={!targetUrl}
              primaryAction={props.action}
              onRenameTriggered={handleOpenDialog}
              onDownloadTriggered={handleDownloadDocument}/>
        </DocumentWrapper>
        )}
        {(!!targetUrl) && 
        <DocumentWrapper>
          <FilePicker 
            containerClassName='w-52 h-[267px]'
            accepts={["application/pdf"]}
            maxSize={MAX_FILE_SIZE.PDF}
            action={props.action}
            onAlertTriggered={info => setAlertInfo(info)}/>
        </DocumentWrapper>}
        {(!!targetUrl && isActionBtnVisible()) &&
        <div className='fixed z-30 flex items-center justify-center bottom-10 left-0 w-full pb-4'>
          {(props.action === ACTIONS.merge)?
          <button type='button' onClick={() => handleMergeDocuments()} className={cn(
              "py-1 px-4 border border-solid border-red-500",
              "rounded-full bg-red-500 text-white cursor-pointer shadow hover:shadow-md"
          )}>
            <Icon icon="bi:arrow-right" className='inline' height={15} width={15}/>
            <span className='ps-2'>{`Merge (${documents.length}) documents`}</span>
          </button>
          :
          <Link href={targetUrl} className={cn(
              "py-1 px-4 border border-solid border-red-500",
              "rounded-full bg-red-500 text-white cursor-pointer shadow dark:shadow-slate-500 hover:shadow-md dark:hover:shadow-slate-500"
          )}>
            <Icon icon="bi:arrow-right" className='inline' height={15} width={15}/>
            <span className='ps-2'>{getTargetActionName(props.action)}</span>
          </Link>}
        </div>}
        <Dialog
          open={dialogOpen}
          onClose={() => handleCloseDialog()}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const documentName = formJson.name;
              handleCloseDialog(documentName);
            },
          }}
        >
          <DialogTitle>Rename</DialogTitle>
          <DialogContent>
            <DialogContentText>
            Please fill in the field below with the new document name.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Document name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={selectedDocument?.filename}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseDialog()}>Cancel</Button>
            <Button type="submit">Rename</Button>
          </DialogActions>
        </Dialog>
        <AppAlert 
          type={alertInfo.type}
          visible={alertInfo.visible}
          message={alertInfo.message}
          onClose={() => setAlertInfo(defaultAlertInfo)}/>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={loading}
          onClose={() => setLoading(false)}
        >
          <Box sx={{ width: 250 }}>
            <div className='flex flex-col justify-start bg-slate-100 dark:bg-slate-600 p-3 rounded'>
              <span className='pb-1'>Loading...</span>
              <LinearProgress />
            </div>
          </Box>
        </Snackbar>
      </div>
    )
  }
  return (
    <div className='flex items-center justify-center py-16 md:px-16'>
      <div className='w-full md:w-2/3 h-full p-10 bg-slate-100 dark:bg-slate-700'>
        <FilePicker 
            accepts={["application/pdf"]}
            maxSize={MAX_FILE_SIZE.PDF}
            containerClassName='w-full h-full'
            singleSelection = {props.action !== ACTIONS.merge}
            action={props.action}
            onAlertTriggered={info => setAlertInfo(info)}/>
        <AppAlert 
            type={alertInfo.type}
            visible={alertInfo.visible}
            message={alertInfo.message}
            onClose={() => setAlertInfo(defaultAlertInfo)}/>
      </div>
    </div>
  )
}

export default FileList