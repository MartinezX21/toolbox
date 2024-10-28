export type Page = {
    path: string;
    title: string;
    subTitle?: string;
}

export type PdfPage = {
    pageIndex: number;
    previewImage: string;
}

export type PdfDocument = {
    id: string;
    filename: string;
    size: string;
    firstPageIndex: number;
    lastPageIndex: number;
    pages: PdfPage[];
}

export type AppTool = {
    icon: string,
    label: string,
    url: string,
    action?: string
}

export type AppToolGroup = {
    group: string,
    tools: AppTool[]
}