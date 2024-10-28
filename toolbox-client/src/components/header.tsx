'use client'

import Image from 'next/image'
import appLogo from '@/assets/toolbox-logo.png'
import appLogoInvered from '@/assets/toolbox-logo-inverted.png'
import usePage from '@/hooks/use-page'
import React, { useContext, useEffect } from 'react'
import { Icon } from '@iconify/react'
import MaterialUISwitch from './MaterialUISwitch'
import { PageLinks } from '@/lib/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AppTheme, ThemeContext } from './ThemeProvider'

function Header() {
    const page = usePage()
    const router = useRouter()
    const queryParams = useSearchParams()
    const themeCtx = useContext(ThemeContext)

    const handleThemeChange = (isDark: boolean) => {
        const theme: AppTheme = isDark? 'dark' : 'light'
        localStorage.setItem("theme", theme)
        if(!!themeCtx) {
            themeCtx.setTheme(theme)
            document.body.classList.toggle("dark")
        }
    }  

    function isFileListEndScreen() {
        return page?.path == PageLinks.filesList && queryParams.size === 0
    }

    useEffect(() => {
        const theme = localStorage.getItem("theme")
        if(theme === "dark") {
            themeCtx?.setTheme('dark')
            document.body.classList.add("dark")
        } else {
            themeCtx?.setTheme('light')
            document.body.classList.remove("dark")
        }
    }, [])

    return (
        <div className='p-2 w-full border-b dark:border-b-gray-600 shadow-sm dark:shadow-gray-600'>
            <div className='flex justify-start items-center ps-3'>
                <Link href={PageLinks.home}>
                    <Image
                        alt="Toolbox"
                        src={themeCtx?.theme === 'dark'? appLogoInvered : appLogo}
                        height={40}/>
                </Link>
                {(!!page && page.path !== PageLinks.home && !isFileListEndScreen()) &&
                <div className='
                    ps-2 relative h-10 
                    before:absolute before:bottom-[0.3em] before:h-4 before:border-l dark:before:border-l-gray-600 before:pe-1
                '>
                    <button onClick={_e => {router.back()}} className='
                        flex items-center absolute font-light -bottom-[0.125em] p-1 px-2 ms-[0.125em]
                        hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md active:ring-1 active:ring-orange-300 focus:ring-1 focus:ring-orange-300
                    '>
                        <Icon icon='bi:arrow-left'/> <span className='ps-1'>Back</span>
                    </button>
                </div>}
                <div className='flex-grow'></div>
                <div className="relative h-10 w-20">
                    <MaterialUISwitch 
                        sx={{ m: 1 }} 
                        checked={themeCtx?.theme === 'dark'}
                        onChange={e => handleThemeChange(e.target.checked)}
                        className='m-0 absolute right-0 bottom-0'/>
                </div>
            </div>
            {!!(page?.subTitle) ?
            <>
                <div className='text-center text-xl leading-8'>
                    {page?.title}
                </div>
                <div className='text-center text-3xl leading-8 tracking-wider'>
                    {page.subTitle}
                </div>
            </> :
            <div className='text-center text-2xl leading-8 tracking-wider'>
                {page?.title}
            </div>}
        </div>
    )
}

export default Header