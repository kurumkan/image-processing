import express, { Request, Response } from 'express';
import https from 'https';
import { StorageConnectorError } from '@kurumkanimgproc/common';
import { AwsClient } from "../services/aws-client";

const router = express.Router();

// fetch a file
router.get('/api/images/:folder/:fileName', (req: Request, res: Response) => {
    const { folder, fileName } = req.params;

    https.get(`https://imgproc-storage.ams3.digitaloceanspaces.com/${folder}/${fileName}`, (response) => {
        response.pipe(res)
    });
});

// fetch a transformed file
router.get('/api/images/transform/:transformation/:folder/:fileName', (req: Request, res: Response) => {
    const { transformation, folder, fileName } = req.params;
    console.log('download request', req.params);	
    const client = AwsClient.getInstance();
    client.checkIfExists(folder, `${transformation}_${fileName}`, (err, data) => {
        if (err) {
            if(err.code === 'NotFound') {
		        console.log('transformation not found - redirecting to processor service', `/api/transform/${transformation}/${folder}/${fileName}`);

                return res.redirect(`/api/transform/${transformation}/${folder}/${fileName}`);
            } else {
                console.log('Head Request error', err);
                throw new StorageConnectorError();
            }
        }
      
        console.log('transformation found');
        https.get(`https://imgproc-storage.ams3.digitaloceanspaces.com/${folder}/${transformation}_${fileName}`, (response) => {
            response.pipe(res)
        });
    });
});

export { router as downloadRouter };
