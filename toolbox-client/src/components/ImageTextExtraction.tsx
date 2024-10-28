'use client'

import React, { useState } from 'react'
import AppAlert, { AppAlertInfo, defaultAlertInfo } from './AppAlert'
import FilePicker from './FilePicker'
import { ACTIONS, MAX_FILE_SIZE } from '@/lib/constants'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { extractTextFromImage } from '@/services/imageOcrService'
import { CircularProgress } from '@mui/material'

function ImageTextExtraction() {
    const [alertInfo, setAlertInfo] = useState<AppAlertInfo>(defaultAlertInfo)
    const [selectedImage, setSelectedImage] = useState<File>()
    const [language, setLanguage] = useState('eng')
    const [extractedText, setExtractedText] = useState<string>()
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setSelectedImage(undefined)
        setLanguage('eng')
        setExtractedText(undefined)
    }

    const handleImageOCR = async () => {
        if(!loading && !!selectedImage) {
            try {
                setLoading(true)
                const output = await extractTextFromImage(selectedImage, language)
                setExtractedText(output)
            } catch (error) {
                setAlertInfo({
                    type: 'error',
                    visible: true,
                    message: "An error occured, please try again."
                })
            } finally {
                setLoading(false)
            }
        }
    } 

    const copyToClipboard = async () => {
        if(!!extractedText) {
            try {
                await navigator.clipboard.writeText(extractedText)
                setAlertInfo({
                    type: 'success',
                    visible: true,
                    message: "The text has been copied to the clipboard"
                })
            } catch (error) {
                setAlertInfo({
                    type: 'error',
                    visible: true,
                    message: "An error occured"
                })
            }
        }
    }

    if(selectedImage) {
        return (
            <div className="m-5 shadow-md dark:shadow-slate-500 border dark:border-slate-500 rounded-md">
                <div className='p-4 border-b dark:border-slate-500 flex items-center'>
                    <div className="grow flex flex-wrap items-center">
                        <p className='text-xl pe-2 pb-1'>Image text language</p>
                        <select 
                            name="txt-lang" 
                            id="txt-lang" 
                            defaultValue={language}
                            onChange={e => setLanguage(e.target.value)}
                            className='border dark:border-slate-500 rounded p-1 px-2 bg-transparent dark:bg-slate-700'
                        >
                            <option value="eng">English</option>
                            <option value="fra">Français</option>
                        </select>
                    </div>
                    <button onClick={_e => handleImageOCR()} className='
                        flex items-center font-light p-1 px-2 rounded-md shadow
                        hover:shadow-md bg-red-500 text-white
                    '>
                        {loading? <CircularProgress size="16px" className='text-white' /> :
                        <Icon icon="bi:arrow-right" className='text-white' height={15} width={15}/>}
                        <span className='ps-1 pb-1'>Extract</span>
                    </button>
                </div>
                <div className='relative flex flex-wrap gap-1'>
                    <div className="p-3 relative h-80 flex-auto md:flex-1 flex flex-col items-center justify-center">
                        <div className="grow flex items-center justify-center h-64 w-64">
                            <Image
                                alt="OCR SOurce"
                                src={URL.createObjectURL(selectedImage)}
                                fill
                                style={{objectFit: 'contain'}} />
                        </div>
                        <div className='flex items-center py-2'>
                            <button onClick={_e => resetForm()} className='
                                flex items-center font-light mt-2 p-1 px-2 rounded-md bg-white dark:bg-slate-700 z-10 shadow dark:shadow-slate-500
                                hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:shadow-slate-500 active:ring-1 active:ring-orange-300 focus:ring-1 focus:ring-orange-300
                            '>
                                <Icon icon='bi:arrow-counterclockwise'/>
                                <span className='ps-1'>Upload a new image</span>
                            </button>
                        </div>
                    </div>
                    <textarea
                        id="image-ocr-txt"
                        defaultValue={extractedText}
                        value={extractedText}
                        onChange={e => setExtractedText(e.target.value)}
                        className='peer flex-auto md:flex-1 w-full md:min-w-80 h-80 resize-none p-2 
                                    box-border border-t md:border-t-0 md:border-l dark:border-slate-500 outline-none 
                                    focus-visible:border focus-visible:border-red-300 text-lg 
                                    font-light rounded-ee-md rounded-bl-md md:rounded-bl-none bg-transparent'></textarea>
                    {(!!extractedText) &&
                    <div className='hidden peer-focus-visible:block hover:block absolute bottom-1 right-1 p-0 rounded shadow z-50'>
                        <button type="button" onClick={_e => copyToClipboard()} className='flex items-center p-1 px-2 shadow dark:shadow-slate-500 hover:shadow-md dark:hover:shadow-slate-500 rounded bg-white dark:bg-slate-700'>
                            <Icon icon='bi:copy'/>
                            <span className='ps-1'>Copy</span>
                        </button>
                    </div>}
                </div>
                <AppAlert
                    type={alertInfo.type}
                    visible={alertInfo.visible}
                    message={alertInfo.message}
                    onClose={() => setAlertInfo(defaultAlertInfo)}/>
            </div>
        )
    } else {
        return (
            <div className='flex items-center justify-center py-16 md:px-16'>
                <div className='w-full md:w-2/3 h-full p-10 bg-slate-100 dark:bg-slate-700'>
                    <FilePicker 
                        containerClassName='w-full h-full'
                        accepts={["image/tiff", "image/jpeg", "image/gif", "image/png", "image/bmp"]}
                        maxSize={MAX_FILE_SIZE.IMG}
                        action={ACTIONS.extractText}
                        singleSelection
                        onAlertTriggered={info => setAlertInfo(info)}
                        onFileSelected={image => setSelectedImage(image)}/>
                    <AppAlert
                        type={alertInfo.type}
                        visible={alertInfo.visible}
                        message={alertInfo.message}
                        onClose={() => setAlertInfo(defaultAlertInfo)}/>
                </div>
            </div>
        )
    }
}

export default ImageTextExtraction