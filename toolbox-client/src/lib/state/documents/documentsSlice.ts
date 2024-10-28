import { PdfDocument } from "@/lib/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type DocumentsState = {
    activeDocumentId: string | undefined
    documents: PdfDocument[]
}

export const initialState: DocumentsState = {
    activeDocumentId: undefined,
    documents: []
}

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        initStore: (state) => {
            state.activeDocumentId = initialState.activeDocumentId
            state.documents = [
                ...initialState.documents
            ]
        },
        addDocuments: (state, action: PayloadAction<PdfDocument[]>) => {
            state.documents = [
                ...state.documents,
                ...action.payload
            ]
        },
        removeDocument: (state, action: PayloadAction<string>) => {
            state.documents = [
                ...state.documents.filter(d => d.id !== action.payload)
            ]
        },
        setAsActive: (state, action: PayloadAction<string>) => {
            state.activeDocumentId = action.payload
        },
        replaceDocument: (state, action: PayloadAction<PdfDocument>) => {
            state.documents = [
                ...state.documents.map(doc => doc.id === action.payload.id? action.payload : doc)
            ]
        }
    }
})

export const { 
    initStore, 
    addDocuments, 
    removeDocument, 
    setAsActive, 
    replaceDocument } = documentsSlice.actions
export default documentsSlice.reducer