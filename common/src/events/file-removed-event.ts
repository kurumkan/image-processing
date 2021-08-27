import { Subjects } from "./subjects";

export interface FileRemovedEvent {
    subject: Subjects.FileRemoved,

    data: { fileName: string }
}
