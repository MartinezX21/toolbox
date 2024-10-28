'use client'

import usePage from '@/hooks/use-page'
import { PageLinks } from '@/lib/constants'
import { initStore } from '@/lib/state/documents/documentsSlice'
import { AppStore, makeStore } from '@/lib/store'
import { useRef } from 'react'
import { Provider } from 'react-redux'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>()
    const page = usePage()

    if (!storeRef.current) {
        storeRef.current = makeStore()
    }
    if(page?.path === PageLinks.home) {
        storeRef.current.dispatch(initStore())
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}