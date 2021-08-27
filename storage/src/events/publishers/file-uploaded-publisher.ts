import { Publisher, Subjects, FileUploadedEvent } from '@kurumkanimgproc/common';

export class FileUploadedPublisher extends Publisher<FileUploadedEvent> {
    subject: Subjects.FileUploaded = Subjects.FileUploaded;
}
