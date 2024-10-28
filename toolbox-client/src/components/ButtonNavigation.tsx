'use client'

import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react'
import React from 'react'

export type ButtonNavigationProps = {
    icon: string
    label: string
    action: () => void
}

function ButtonNavigation(props: ButtonNavigationProps) {
  return (
    <button onClick={_e => props.action()} className={cn(
        "flex items-center justify-center min-w-16 py-1 px-3",
        "rounded-full bg-red-500 shadow hover:shadow-md text-white"
    )}>
        <Icon icon={props.icon}/>
        <span className='ps-2'>{props.label}</span>
    </button>
  )
}

export default ButtonNavigation