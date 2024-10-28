import { postForm, RestClient } from "@/lib/rest-client"
import { PdfDocument } from "@/lib/types"
import { getUrl } from "@/lib/utils"

export const parseDocument = (pdfFile: File, onProgress?: (progress: number) => void) => new Promise<PdfDocument>((resolve, reject) => {
    const form: FormData = new FormData()
    form.append("file", pdfFile)
    postForm<PdfDocument>("/pdf/manipulate/pages", form, onProgress)
        .then(response => {
            resolve(response.data)
        })
        .catch(err => reject(err))
})

export const splitDocument = (document: PdfDocument, splitPoints: number[]) => new Promise<PdfDocument[]>((resolve, reject) => {
    const param = `points=${splitPoints.join(',')}`
    RestClient.post<PdfDocument[]>(getUrl(`/pdf/manipulate/split/${document.id}/${document.filename}`, [param]))
        .then(response => {
            resolve(response.data)
        })
        .catch(err => reject(err))
})

export const removeDocumentPages = (document: PdfDocument, pageIndexes: number[]) => new Promise<PdfDocument>((resolve, reject) => {
    const param = `page_numbers=${pageIndexes.join(',')}`
    RestClient.post<PdfDocument>(getUrl(`/pdf/manipulate/remove-pages/${document.id}/${document.filename}`, [param]))
        .then(response => {
            resolve(response.data)
        })
        .catch(err => reject(err))
})

export const extractDocumentPages = (document: PdfDocument, pageIndexes: number[]) => new Promise<PdfDocument>((resolve, reject) => {
    const param = `page_numbers=${pageIndexes.join(',')}`
    RestClient.post<PdfDocument>(getUrl(`/pdf/manipulate/extract-pages/${document.id}/${document.filename}`, [param]))
        .then(response => {
            resolve(response.data)
        })
        .catch(err => reject(err))
})

export const mergeDocuments = (documentList: PdfDocument[]) => new Promise<PdfDocument>((resolve, reject) => {
    const param = `document_ids=${documentList.map(doc => doc.id).join(',')}`
    RestClient.post<PdfDocument>(getUrl("/pdf/manipulate/merge", [param]))
        .then(response => {
            resolve(response.data)
        })
        .catch(err => reject(err))
})