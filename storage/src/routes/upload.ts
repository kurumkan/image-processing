import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { parse } from 'url';
import {
    StorageConnectorError,
    requireAuth,
    validateRequest
} from '@kurumkanimgproc/common';
import { AwsClient } from "../services/aws-client";
import { natsWrapper } from "../nats-wrapper";
import { FileUploadedPublisher } from "../events/publishers/file-uploaded-publisher";

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
    async (req: Request, res: Response) => {
        const folder = req.currentUser!.id;
        const fileName = req.body.fileName;
        const contentType = req.body.contentType;

        const client = AwsClient.getInstance();

        try {
            const { url: uploadUrl, key } = client.getSignedUrl(folder, fileName, contentType);
            const { pathname, } = parse(uploadUrl);

            if (!pathname) {
                console.log('Invalid presigned url ', uploadUrl);
                throw new StorageConnectorError();
            }

            // url without query param
            const resultUrl = "/api/images" + pathname;

            await new FileUploadedPublisher(natsWrapper.client).publish({
                id: new Buffer(uploadUrl).toString('base64'),
                userId: req.currentUser!.id,
                url: resultUrl!,
                fileName
            });

            console.log('FileUploadedEvent published', resultUrl);

            res.status(200).json({
                uploadUrl,
                resultUrl,
                key
            });
        } catch (e) {
            console.log('Upload file error', e);
            throw new StorageConnectorError();
        }
    });

export { router as uploadRouter };