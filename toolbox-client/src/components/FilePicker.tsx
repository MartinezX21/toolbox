'use client'

import React, { useState } from 'react';

import { formatNumber, getTargetUrl } from '@/lib/utils';
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils';
import { LinearProgress } from '@mui/material';
import { ACTIONS } from '@/lib/constants';
import { parseDocument } from '@/services/documentService';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks';
import { addDocuments, setAsActive } from '@/lib/state/documents/documentsSlice';
import { AppAlertInfo } from './AppAlert';

interface Props {
    accepts: string[]
    maxSize: number
    containerClassName: string
    singleSelection?: boolean
    action?: string
    onAlertTriggered: (info: AppAlertInfo) => void
    onFileSelected?: (file: File) => void
}

export default function FilePicker(props: Props) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [dragInitiated, setDragInitiated] = useState(false)

    function isSingleSelection() {
        const eligibleActions = [ACTIONS.merge]
        return props.singleSelection === true ||
            (!!props.action && !eligibleActions.includes(props.action))
    }

    async function handleSelected(selectedFile: File | null) {
        if(selectedFile && props.accepts.includes(selectedFile.type)) {
            const sizeInBytes = selectedFile.size;
            const sizeInKB = sizeInBytes / 1024;
            if(sizeInKB > props.maxSize) {
                props.onAlertTriggered({
                    type: 'error',
                    visible: true,
                    message: `File size must not exceed ${props.maxSize}KB, actual size is ${formatNumber(sizeInKB, 0, 2)}KB`
                })
            } else if(selectedFile.type === "application/pdf") {
                setLoading(true)
                try {
                    const pdfDocument = await parseDocument(selectedFile)
                    // dispatch
                    dispatch(addDocuments([pdfDocument]))
                    dispatch(setAsActive(pdfDocument.id))
                    if(isSingleSelection()) {
                        // redirect
                        const targetUrl = getTargetUrl(props.action)
                        if(!!targetUrl) {
                            router.push(`${targetUrl}?l=${pdfDocument.id}`)
                        }
                    }
                } catch (error) {
                    props.onAlertTriggered({
                        type: 'error',
                        visible: true,
                        message: "Failed to upload the file"
                    })
                } finally {
                    setLoading(false)
                }
            } else if(selectedFile.type.startsWith("image/")) {
                if(!!props.onFileSelected) {
                    props.onFileSelected(selectedFile)
                }
            }
        } 
        else if(selectedFile) {
            console.log(selectedFile.type)
            props.onAlertTriggered({
                type: 'error',
                visible: true,
                message: "Invalid file type"
            })
        }
    }
    
    return (
        <div 
            className={cn(props.containerClassName, "border border-dashed border-gray-500", {
                "border-solid border-red-500": dragInitiated
            })}
            onDragOver={e => {
                e.preventDefault();
                setDragInitiated(true);
            }}
            onDragLeave={e => {
                e.preventDefault();
                setDragInitiated(false);
            }}
            onDrop={e => {
                e.preventDefault();
                handleSelected(e.dataTransfer.files[0]);
                setDragInitiated(false);
            }}
        >
            <div className="flex w-full h-full flex-col items-center justify-center p-4">
                <Icon icon="bi:cloud-upload-fill" width={42} height={42} className='self-center text-red-500' />
                <span className='text-center text-slate-500 dark:text-slate-400 py-4'>
                    Drag and drop a file here or browse to select one from your disk.
                </span> 
                <div className="flex justify-center items-center">
                    {loading?
                    <div className='w-40'>
                        <LinearProgress />
                    </div>
                    :<div className="relative ms-2">
                        <label 
                            htmlFor="xp-file-picker-input" 
                            className={cn(
                                "block box-border p-3 px-4 border border-solid border-red-500",
                                "rounded bg-red-500 text-white dark:text-slate-300 cursor-pointer shadow",
                                "hover:shadow-md hover:scale-105"
                            )}
                        >
                            <Icon icon="bi:upload" className='inline' height={15} width={15}/>
                            <span className='ps-2'>Browse</span>
                        </label>
                        <input 
                            className="absolute left-0 top-0 w-full overflow-hidden -z-10"
                            id="xp-file-picker-input" 
                            type="file" 
                            accept={props.accepts.join(",")}
                            onChange={e => handleSelected(e.target.files? e.target.files[0] : null)}/>
                    </div>}
                </div>
            </div>
        </div>
    )
}