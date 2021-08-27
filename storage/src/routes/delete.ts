import express, { Request, Response } from 'express';

import { StorageConnectorError, requireAuth } from '@kurumkanimgproc/common';
import { AwsClient } from "../services/aws-client";
import { natsWrapper } from "../nats-wrapper";
import { FileRemovedPublisher } from "../events/publishers/file-removed-publisher";

const router = express.Router();

// delete a file, filename is passed as base64 query param
router.delete('/api/images/:fileName', requireAuth, async (req: Request, res: Response) => {
    const folder = req.currentUser!.id;
    const fileName = req.params.fileName;

    const client = AwsClient.getInstance();
    console.log('fileName to delete', fileName)

    client.deleteObject(folder, fileName,(err, data) => {
        if (err) {
            console.log('Delete file error', err);
            throw new StorageConnectorError();
        } else {
            new FileRemovedPublisher(natsWrapper.client).publish({ fileName });
            console.log('File deleted', data);
            res.status(200).send(data);
        }
    });
});

export { router as deleteRouter };