import express, { Request, Response } from 'express';
import { requireAuth, StorageConnectorError } from '@kurumkanimgproc/common';
import { AwsClient } from "../services/aws-client";

const router = express.Router();

// fetch a file
router.get('/api/images/:folder/:fileName', requireAuth, (req: Request, res: Response) => {
    const { folder, fileName } = req.params;

    res.redirect(`https://imgproc-storage.ams3.digitaloceanspaces.com/${folder}/${fileName}`);
});

// fetch a transformed file
router.get('/api/images/transform/:transformation/:name', requireAuth, (req: Request, res: Response) => {
    const folder = req.currentUser!.id;
    const transformation = req.params.transformation;
    const fileName = req.params.name;

    const client = AwsClient.getInstance();
    client.checkIfExists(folder, `${transformation}_${fileName}`, (err, data) => {
        if (err) {
            if(err.code === 'NotFound') {
                return res.redirect(`https://image-processor/api/${folder}/${transformation}/${fileName}`);
            } else {
                console.log('Head Request error', err);
                throw new StorageConnectorError();
            }
        }

        res.redirect(`https://imgproc-storage.ams3.digitaloceanspaces.com/${folder}/${transformation}_${fileName}`);
    });
});

export { router as downloadRouter };
