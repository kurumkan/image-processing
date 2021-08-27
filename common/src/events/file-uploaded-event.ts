import { Subjects } from "./subjects";

export interface FileUploadedEvent {
    subject: Subjects.FileUploaded,

    data: {
        id: string,
        userId: string,
        url: string,
        fileName: string
    }
}