import { Publisher, Subjects, FileRemovedEvent } from '@kurumkanimgproc/common';

export class FileRemovedPublisher extends Publisher<FileRemovedEvent> {
    subject: Subjects.FileRemoved = Subjects.FileRemoved;
}
