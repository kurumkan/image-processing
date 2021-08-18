import express, { Request, Response } from 'express';

import { requireAuth } from '@kurumkanimgproc/common';

const router = express.Router();

// fetch a file
router.get('/api/images/:name', requireAuth, (req: Request, res: Response) => {
    const folder = req.currentUser!.id;
    const fileName = req.params.name;

    res.redirect(`https://imgproc-storage.ams3.digitaloceanspaces.com/${folder}/${fileName}`);
});

// fetch a transformed file
router.get('/api/images/:transformation/:name', requireAuth, (req: Request, res: Response) => {
    const folder = req.currentUser!.id;
    const transformation = req.params.transformation;
    const fileName = req.params.name;

    // we should check if transformation exists
    // if true - redirect: res.redirect(`https://imgproc-storage.ams3.digitaloceanspaces.com/${folder}/${transformation_fileName}`);
    // else make request to imgproc - get image from there and return

    res.redirect(`https://imgproc-storage.ams3.digitaloceanspaces.com/${folder}/${fileName}`);
});

export { router as downloadRouter };