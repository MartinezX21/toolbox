'use client'
import { getResourceURI } from '@/lib/rest-client'
import { PdfDocument } from '@/lib/types'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { ACTIONS, PageLinks } from '@/lib/constants'
import { useAppDispatch } from '@/hooks'
import { setAsActive } from '@/lib/state/documents/documentsSlice'
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"

type DocumentItemProps = {
    document: PdfDocument
    primaryAction: string
    showAdditionalActions?: boolean
    onRenameTriggered: (document: PdfDocument) => void
    onDownloadTriggered: (document: PdfDocument) => void
}

function DocumentItem(props: DocumentItemProps) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { 
        document,
        primaryAction,
        showAdditionalActions,
        onRenameTriggered,
        onDownloadTriggered } = props
    const [menuBtnAnchor, setMenuBtnAnchor] = useState<null | HTMLElement>(null)
    const menuOpen = Boolean(menuBtnAnchor)
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuBtnAnchor(event.currentTarget)
    }
    const handleClose = () => {
        setMenuBtnAnchor(null)
    }
    const executeMenuAction = (document: PdfDocument, action: 'split' | 'remove' | 'extract') => {
        dispatch(setAsActive(document.id))
        setMenuBtnAnchor(null)
        switch(action) {
            case 'split':
                router.push(PageLinks.split)
                break
            case 'remove':
                router.push(PageLinks.removePages)
                break
            case 'extract':
                router.push(PageLinks.extractPages)
                break
        }
    }

    return (
        <motion.div layoutId={document.id} className='group rounded bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 p-2'>
            <div className='pb-2 flex items-center'>
                <div className='p-1 bg-slate-200 dark:bg-slate-600 group-hover:bg-slate-300 dark:group-hover:bg-slate-500 rounded'>
                    <Icon icon="bi:filetype-pdf" width={20} height={20} className='text-red-500' />
                </div>
                <div className='grow px-2'>
                    <h5 title={document.filename} className='leading-tight w-32 font-medium text-lg line-clamp-1 text-ellipsis overflow-hidden break-words hyphens-auto'>
                        {document.filename}
                    </h5>
                    <p className='leading-none italic text-xs'>
                        {`${document.pages.length} page(s)`}
                    </p>
                </div>
                <button 
                    type="button" className='p-2'
                    id={`doc-action-trigger/${document.id}`}
                    aria-controls={menuOpen ? `doc-action-menu/${document.id}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                    onClick={openMenu}
                >
                    <Icon icon="bi:three-dots-vertical" width={16} height={16} className='text-gray-500' />
                </button>
                <Menu
                    id={`doc-action-menu/${document.id}`}
                    anchorEl={menuBtnAnchor}
                    open={menuOpen}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': `doc-action-trigger/${document.id}`,
                    }}
                >
                    <MenuItem onClick={() => {onRenameTriggered(document); handleClose()}}>
                        <ListItemIcon>
                            <Icon icon="bi:pen" width={16} height={16} className='text-red-500' />
                        </ListItemIcon>
                        <ListItemText>Rename</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => {onDownloadTriggered(document); handleClose()}}>
                        <ListItemIcon>
                            <Icon icon="bi:download" width={16} height={16} className='text-red-500' />
                        </ListItemIcon>
                        <ListItemText>Download</ListItemText>
                    </MenuItem>
                    {(!!showAdditionalActions || primaryAction !== ACTIONS.merge) && <Divider />}
                    {(!!showAdditionalActions || primaryAction === ACTIONS.split) &&
                    <MenuItem onClick={() => executeMenuAction(document, 'split')}>
                        <ListItemIcon>
                            <Icon icon="mdi:scissors-cutting" width={16} height={16} className='text-red-500' />
                        </ListItemIcon>
                        <ListItemText>Split</ListItemText>
                    </MenuItem>}
                    {(!!showAdditionalActions || primaryAction === ACTIONS.removePages) &&
                    <MenuItem onClick={() => executeMenuAction(document, 'remove')}>
                        <ListItemIcon>
                            <Icon icon="ph:exclude-square-fill" width={16} height={16} className='text-red-500' />
                        </ListItemIcon>
                        <ListItemText>Remove pages</ListItemText>
                    </MenuItem>}
                    {(!!showAdditionalActions || primaryAction === ACTIONS.extractPages) &&
                    <MenuItem onClick={() => executeMenuAction(document, 'extract')}>
                        <ListItemIcon>
                            <Icon icon="ph:intersect-square-fill" width={16} height={16} className='text-red-500' />
                        </ListItemIcon>
                        <ListItemText>Extract pages</ListItemText>
                    </MenuItem>}
                </Menu>
            </div>
            <div className='h-52 overflow-hidden'>
                <div className='w-52 h-72 relative'>
                    <Image
                        alt={document.filename}
                        src={getResourceURI(`/files/${document.pages[0].previewImage}`)}
                        fill/>
                </div>
            </div>
        </motion.div>
    )
}

export default DocumentItem