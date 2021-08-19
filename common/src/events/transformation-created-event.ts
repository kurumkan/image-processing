import { Subjects } from "./subjects";

export interface TransformationCreatedEvent {
    subject: Subjects.TransformationCreated,
    data: {
        id: string,
        version: number,
        userId: string,
        expiresAt: string,
        url: string
    }
}
