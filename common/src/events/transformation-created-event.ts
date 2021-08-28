import { Subjects } from "./subjects";

export interface TransformationCreatedEvent {
    subject: Subjects.TransformationCreated,
    data: {
        expiresAt: string,
        folder: string,
        fileName: string
    }
}
