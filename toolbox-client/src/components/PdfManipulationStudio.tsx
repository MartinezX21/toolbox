'use client'

import { useAppDispatch, useAppSelector } from '@/hooks'
import { getResourceURI } from '@/lib/rest-client'
import { PdfDocument } from '@/lib/types'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Alert, CircularProgress, Snackbar } from '@mui/material'
import { extractDocumentPages, removeDocumentPages, splitDocument } from '@/services/documentService'
import { addDocuments } from '@/lib/state/documents/documentsSlice'
import { useRouter } from 'next/navigation'
import { ACTIONS, PageLinks } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'

type PdfManipulationStudioProps = {
    action: string
}

function PdfManipulationStudio(props: PdfManipulationStudioProps) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [workingDocuments, setWorkingDocuments] = useState<PdfDocument[]>([])
    const [removedPageNumbers, setRemovedPageNumbers] = useState<number[]>([])
    const [extractedPageNumbers, setExtractedPageNumbers] = useState<number[]>([])
    const [notif, setNotif] = useState<{visible: boolean, message: string}>()
    const [loading, setLoading] = useState(false);
    const { activeDocumentId, documents } = useAppSelector(state => {
        return {
            activeDocumentId: state.documents.activeDocumentId,
            documents: state.documents.documents
        }
    })

    function isSubmitButtonVisible (){
        const activeDocument = documents.find(it => it.id === activeDocumentId)
        switch(props.action) {
            case ACTIONS.split:
                return workingDocuments.length > 1
            case ACTIONS.removePages:
                return (removedPageNumbers.length > 0 && removedPageNumbers.length !== activeDocument?.pages.length)
            case ACTIONS.extractPages:
                return (extractedPageNumbers.length > 0 && extractedPageNumbers.length !== activeDocument?.pages.length)
            default:
                return false
        }
    }

    function isPageDisabled(pageIndex: number) {
        if(props.action === ACTIONS.removePages) {
            return removedPageNumbers.includes(pageIndex)
        }
        else if(props.action === ACTIONS.extractPages) {
            return ! extractedPageNumbers.includes(pageIndex)
        }
        return false
    }

    const handleSubmit = () => {
        if(props.action === ACTIONS.split) {
            saveSplittedDocuments()
        }
        else if(props.action === ACTIONS.removePages) {
            removeSelectedPages()
        } 
        else if(props.action === ACTIONS.extractPages) {
            extractSelectedPages()
        }
    }
    
    async function removeSelectedPages() {
        const activeDocument = documents.find(it => it.id === activeDocumentId)
        if(loading || activeDocument === undefined) {
            return
        }
        try {
            setLoading(true)
            const pdfDocument = await removeDocumentPages(activeDocument, removedPageNumbers)
            dispatch(addDocuments([pdfDocument]))
            router.push(PageLinks.filesList)
        } catch (error) {
            setNotif({
                visible: true,
                message: "Something went wrong, please try again."
            })
        } finally {
            setLoading(false)
        }
    }

    async function extractSelectedPages() {
        const activeDocument = documents.find(it => it.id === activeDocumentId)
        if(loading || activeDocument === undefined) {
            return
        }
        try {
            setLoading(true)
            const pdfDocument = await extractDocumentPages(activeDocument, extractedPageNumbers)
            dispatch(addDocuments([pdfDocument]))
            router.push(PageLinks.filesList)
        } catch (error) {
            setNotif({
                visible: true,
                message: "Something went wrong, please try again."
            })
        } finally {
            setLoading(false)
        }
    }

    async function saveSplittedDocuments() {
        const activeDocument = documents.find(it => it.id === activeDocumentId)
        if(loading || activeDocument === undefined) {
            return
        }
        try {
            setLoading(true)
            const splitPoints = []
            for(let i=1; i<workingDocuments.length; i++) {
                splitPoints.push(workingDocuments[i].pages[0].pageIndex)
            }
            const splittedDocuments = await splitDocument(activeDocument, splitPoints)
            dispatch(addDocuments(splittedDocuments))
            router.push(PageLinks.filesList)
        } catch (error) {
            setNotif({
                visible: true,
                message: "Something went wrong, please try again."
            })
        } finally {
            setLoading(false)
        }
    }

    function handleSplit(currendDocument:PdfDocument, splitIndex: number) {
        // -- first part
        let pdf1: PdfDocument = {
            ...currendDocument
        }
        pdf1.id = currendDocument.id + "-"+1
        pdf1.lastPageIndex = splitIndex
        pdf1.pages = []
        for(let i=currendDocument.firstPageIndex; i<=splitIndex; i++) {
            pdf1.pages.push(currendDocument.pages[i - currendDocument.firstPageIndex])
        }
        // -- second part
        let pdf2: PdfDocument = {
            ...currendDocument
        }
        pdf2.id = currendDocument.id + "-"+2
        pdf2.firstPageIndex = splitIndex + 1
        pdf2.pages = []
        for(let i=splitIndex + 1; i<=currendDocument.lastPageIndex; i++) {
            pdf2.pages.push(currendDocument.pages[i - currendDocument.firstPageIndex])
        }
        //
        setWorkingDocuments(docs => {
            let tmpList: PdfDocument[] = []
            docs.forEach(doc => {
                if(doc.id === currendDocument.id) {
                    tmpList.push(pdf1)
                    tmpList.push(pdf2)
                } else {
                    tmpList.push(doc)
                }
            })
            return tmpList
        })
    }

    useEffect(() => {
        const activeDocument = documents.find(it => it.id === activeDocumentId)
        setWorkingDocuments(!!activeDocument? [activeDocument] : [])
        setRemovedPageNumbers([])
        setExtractedPageNumbers([])
    }, [activeDocumentId, documents])

    return (
        <>
            <div className='w-full h-full p-2 sm:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xg:grid-cols-4 gap-x-0 gap-y-0 md:gap-y-5'>
                {workingDocuments.map((pdfDocument, dIdx) => 
                <>
                    {pdfDocument.pages.map((page, pIdx) => 
                    <div key={`${page.pageIndex}`} className={cn(
                        'place-self-stretch relative p-4 flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-700',
                        {
                            'mb-1 md:mb-0 md:me-1': (dIdx !== workingDocuments.length - 1) && (pIdx === pdfDocument.pages.length - 1),
                            'rounded-lg': pdfDocument.pages.length === 1,
                            'rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-s-lg': (pdfDocument.pages.length > 1) && (pIdx === 0),
                            'rounded-bl-lg rounded-br-lg md:rounded-bl-none md:rounded-e-lg': (pdfDocument.pages.length > 1) && (pIdx === pdfDocument.pages.length - 1)
                        }
                    )}>
                        <div className='h-6 w-full mb-4'>
                            {(pIdx === 0)&&
                            <p className='bg-slate-400 dark:bg-gray-600 text-white dark:text-gray-300 leading-normal w-fit py-1 px-2 rounded-md line-clamp-1 text-ellipsis overflow-hidden'>
                                {pdfDocument.filename} {`${(workingDocuments.length > 1)? '('+(dIdx + 1)+')' : ''}` }
                            </p>}
                        </div>
                        <AnimatePresence>
                            <motion.div layoutId={pIdx==0? pdfDocument.id : undefined} className='group w-52 h-72 relative'>
                                <div className={cn('hidden absolute -top-4 -right-2 py-1 px-2 bg-white dark:bg-slate-800 rounded z-10 shadow dark:shadow-slate-500', {
                                    'group-hover:block': (props.action === ACTIONS.removePages || props.action === ACTIONS.extractPages)
                                })}>
                                    {(removedPageNumbers.includes(page.pageIndex) || extractedPageNumbers.includes(page.pageIndex))?
                                    <button type="button" onClick={() => {
                                        setRemovedPageNumbers(list => list.filter(idx => idx !== page.pageIndex))
                                        setExtractedPageNumbers(list => list.filter(idx => idx !== page.pageIndex))
                                    }}>
                                        <Icon icon="bi:arrow-counterclockwise" className='inline text-red-500' height={15} width={15}/>
                                        <span className='ps-2'>Restore</span>
                                    </button>
                                    : (props.action === ACTIONS.removePages)?
                                    <button type="button" onClick={() => {
                                        setRemovedPageNumbers(list => [
                                            ...list,
                                            page.pageIndex
                                        ])
                                    }}>
                                        <Icon icon="bi:trash" className='inline text-red-600' height={15} width={15}/>
                                        <span className='ps-2'>Remove</span>
                                    </button>
                                    :
                                    <button type="button" onClick={() => {
                                        setExtractedPageNumbers(list => [
                                            ...list,
                                            page.pageIndex
                                        ])
                                    }}>
                                        <Icon icon="bi:file-earmark-check" className='inline text-red-500' height={15} width={15}/>
                                        <span className='ps-2'>Extract</span>
                                    </button>}
                                </div>
                                <Image
                                    alt={`Page ${page.pageIndex}`}
                                    src={getResourceURI(`/files/${page.previewImage}`)} 
                                    className={cn('drop-shadow-md', {
                                        'opacity-50': isPageDisabled(page.pageIndex)
                                    })}
                                    fill/>
                            </motion.div>
                        </AnimatePresence>
                        <p className={cn('mt-2 bg-white dark:bg-gray-600 p-1 px-4 leading-normal rounded-full drop-shadow-md', {
                            'opacity-50': isPageDisabled(page.pageIndex)
                        })}>
                            <span className=''>Page {page.pageIndex + 1}</span>
                        </p>
                        {((props.action === ACTIONS.split) && (pIdx !== pdfDocument.pages.length - 1)) &&
                        <div className="z-10 h-8 md:h-full w-full md:w-8 absolute -bottom-8 md:bottom-0 md:-right-4 flex items-center justify-center">
                            <div className='w-2/3 md:w-[1px] md:h-2/3 border-b md:border-b-0 md:border-l dark:border-gray-500 absolute'/>
                            <button 
                                type='button' 
                                onClick={_e => handleSplit(pdfDocument, page.pageIndex)}
                                className='bg-red-500 shadow dark:shadow-slate-500 z-20 py-1 px-2 rounded-full hover:shadow-md dark:hover:shadow-slate-500'>
                                <Icon icon="mdi:scissors-cutting" className='inline text-white' height={16} width={16} />
                            </button>
                        </div>}
                    </div>
                    )}
                </>)}
            </div>
            {isSubmitButtonVisible() &&
            <div className='fixed z-30 flex items-center justify-center bottom-10 left-0 w-full pb-4'>
                <button type='button' onClick={_e => handleSubmit()} className={cn(
                    "py-1 px-4 border border-solid border-red-500",
                    "rounded-full bg-red-500 text-white cursor-pointer shadow dark:shadow-slate-500 hover:shadow-md dark:hover:shadow-slate-500"
                )}>
                    {loading? <CircularProgress size="16px" className='text-white' /> :
                    <Icon icon="bi:save" className='inline' height={15} width={15}/>}
                    <span className='ps-2'>Save</span>
                </button>
            </div>}
            <Snackbar
                open={notif?.visible}
                autoHideDuration={6000}
                onClose={_e => setNotif({
                    visible: false,
                    message: ""
                })}
            >
                <Alert
                    onClose={_e => setNotif({
                        visible: false,
                        message: ""
                    })}
                    severity='error'
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notif?.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default PdfManipulationStudio