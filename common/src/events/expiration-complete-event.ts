import { Subjects } from "./subjects";

export interface ExpirationCompleteEvent {
    subject: Subjects.ExpirationComplete,
    data: {
        folder: string,
        fileName: string
    }
}
