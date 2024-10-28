import axios, { AxiosResponse } from "axios";

const config = {
    baseUrl: "http://localhost:8080/toolbox-api",
    defaultHeader: {'Content-Type': 'application/json'},
}

export const RestClient = axios.create({
    baseURL: config.baseUrl,
    headers: config.defaultHeader
})

export const getResourceURI = (relativePath: string) => `${config.baseUrl}${relativePath}`

export async function postForm<R>(url: string, form: FormData, onProgress?: (progress: number) => void) {
    return RestClient.post<R>(url, form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function(progressEvent) {
            const total = progressEvent.total || 100;
            const percentCompleted = Math.round((progressEvent.loaded * 100) / total)
            if(onProgress !== undefined) {
                onProgress(percentCompleted)
            }
        },
    })
}

export async function downloadFile(url: string, onProgress?: (progress: number) => void) {
    return RestClient.get<Blob, AxiosResponse<Blob>>(url, {
        responseType: 'blob',
        onDownloadProgress: function(progressEvent) {
            const total = progressEvent.total || 100;
            const percentCompleted = Math.round((progressEvent.loaded * 100) / total)
            if(onProgress !== undefined) {
                onProgress(percentCompleted)
            }
        },
    })
}