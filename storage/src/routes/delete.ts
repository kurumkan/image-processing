import express, { Request, Response } from 'express';

import { StorageConnectorError, requireAuth } from '@kurumkanimgproc/common';
import { AwsClient } from "../services/aws-client";

const router = express.Router();

// delete a file, filename is passed as base64 query param
router.delete('/api/images/:name', requireAuth, async (req: Request, res: Response) => {
    const folder = req.currentUser!.id;
    const fileName = req.params.name;

    const client = AwsClient.getInstance();

    client.deleteObject(folder, fileName,(err, data) => {
        if (err) {
            console.log('Delete file error', err);
            throw new StorageConnectorError();
        } else {
            console.log('Data', data);
            res.status(200).send(data);
        }
    });
});

export { router as deleteRouter };