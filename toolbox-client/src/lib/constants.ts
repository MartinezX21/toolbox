import { AppToolGroup, Page } from "./types";

export const ACTIONS = {
    extractText: "image-ocr:extract-text",
    split: "pdf:split",
    merge: "pdf:merge",
    extractPages: "pdf:extract-pages",
    removePages: "pdf:remove-pages",
    plotFunction: "math-box:plot-function"
}

export const PageLinks = {
    home: "/",
    filesList: "/files-list",
    imageOcr: "/image-ocr",
    extractPages: "/pdf-manipulation/extract-pages",
    removePages: "/pdf-manipulation/remove-pages",
    merge: "/pdf-manipulation/merge",
    split: "/pdf-manipulation/split",
    plot: "/plot"
} 

export const AppPages: Page[] = [
    {
        path: PageLinks.home,
        title: "Home"
    },
    {
        path: PageLinks.filesList,
        title: "Home",
        subTitle: "Files List"
    },
    {
        path: PageLinks.imageOcr,
        title: "Other tools",
        subTitle: "Image OCR"
    },
    {
        path: PageLinks.extractPages,
        title: "PDF Manipulation",
        subTitle: "Extract Pages"
    },
    {
        path: PageLinks.removePages,
        title: "PDF Manipulation",
        subTitle: "Remove Pages"
    },
    {
        path: PageLinks.merge,
        title: "PDF Manipulation",
        subTitle: "Merge"
    },
    {
        path: PageLinks.split,
        title: "PDF Manipulation",
        subTitle: "Split"
    },
    {
        path: PageLinks.plot,
        title: "Other tools",
        subTitle: "Plot Functions"
    }
]

export const AvailableTools: AppToolGroup[] = [
    {
        group: "PDF Manipulations",
        tools: [
            {
                icon: "mdi:scissors-cutting",
                label: "Split",
                url: PageLinks.filesList,
                action: ACTIONS.split
            },
            {
                icon: "bi:sign-merge-left",
                label: "Merge",
                url: PageLinks.merge
            },
            {
                icon: "ph:exclude-square-fill",
                label: "Remove Pages",
                url: PageLinks.filesList,
                action: ACTIONS.removePages
            },
            {
                icon: "ph:intersect-square-fill",
                label: "Extract Pages",
                url: PageLinks.filesList,
                action: ACTIONS.extractPages
            }
        ]
    },
    {
        group: "Other tools",
        tools: [
            {
                icon: "mdi:image-text",
                label: "Image Text Extractor",
                url: PageLinks.imageOcr
            },
            // {
            //     icon: "mdi:graph-line",
            //     label: "Plot Functions",
            //     url: PageLinks.plot
            // }
        ]
    }
]

export const MAX_FILE_SIZE = {
    PDF: 25 * 1024, // 25MB
    IMG:  5 * 1024  //  5MB
}