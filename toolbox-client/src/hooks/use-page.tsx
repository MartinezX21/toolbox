import { AppPages } from "@/lib/constants"
import { Page } from "@/lib/types"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function usePage() {
    const [page, setPage] = useState<Page>()

    const pathname = usePathname()
    
    useEffect(() => {
        setPage(AppPages.find(p => p.path === pathname))
    }, [pathname])

    return page;
}