import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    StorageConnectorError,
    requireAuth,
    validateRequest
} from '@kurumkanimgproc/common';
import { AwsClient } from "../services/aws-client";

const router = express.Router();

// return upload url from s3
router.post('/api/images', requireAuth, [
        body('fileName')
            .not()
            .isEmpty()
            .withMessage('fileName must be provided'),
        body('contentType')
            .not()
            .isEmpty()
            .withMessage('contentType must be provided')
    ], validateRequest,
    (req: Request, res: Response) => {
        // const folder = req.currentUser!.id;
        const folder = req.currentUser!.id;
        const fileName = req.body.fileName;
        const contentType = req.body.contentType;

        const client = AwsClient.getInstance();

        try {
            const url = client.getSignedUrl(folder, fileName, contentType);
            res.status(200).send(url);
        } catch (e) {
            console.log('Upload file error', e);
            throw new StorageConnectorError();
        }
    });

export { router as uploadRouter };