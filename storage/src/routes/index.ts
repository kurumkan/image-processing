import express, { Request, Response } from 'express';

import { NotFoundError, StorageConnectorError, requireAuth } from '@kurumkanimgproc/common';

import { AwsClient } from "../services/aws-client";

const router = express.Router();

// listing all the files from a user
router.get('/api/images', requireAuth, (req: Request, res: Response) => {
        const folder = req.currentUser!.id;

        const client = AwsClient.getInstance();
        client.listObjects(folder, (err, data) => {
            if (err) {
                console.log('List files error', err);
                throw new StorageConnectorError();
            } else if (!data.Contents) {
                throw new NotFoundError();
            } else {
                const fileNames = data.Contents.filter(({ Key: key }) => key !== `${folder}/`);
                res.status(200).send(fileNames);
            }
        })
    });

export { router as indexRouter };