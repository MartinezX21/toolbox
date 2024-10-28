import { postForm } from "@/lib/rest-client"

export const extractTextFromImage = (imageFile: File, language: string) => new Promise<string>((resolve, reject) => {
    const form: FormData = new FormData()
    form.append("image", imageFile)
    form.append("lang", language)
    postForm<string>("/img-processing/extract-text", form)
        .then(response => {
            resolve(response.data)
        })
        .catch(err => reject(err))
})