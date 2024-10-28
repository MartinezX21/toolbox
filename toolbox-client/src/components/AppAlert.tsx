'use client'

import { Alert, Snackbar } from '@mui/material'
import React from 'react'

export type AppAlertInfo = {
    type: 'error' | 'warning' | 'info' | 'success'
    visible: boolean, 
    message?: string
}

export const defaultAlertInfo: AppAlertInfo = {
    type: 'info',
    visible: false
}

type AppAlertProps = AppAlertInfo & {
    onClose: () => void
}

function AppAlert(props: AppAlertProps) {
  return (
    <Snackbar
        open={props.visible}
        autoHideDuration={6000}
        onClose={_e => props.onClose()}
    >
        <Alert
            onClose={_e => props.onClose()}
            severity={props.type}
            variant="filled"
            sx={{ width: '100%' }}
        >
            {props.message}
        </Alert>
    </Snackbar>
  )
}

export default AppAlert