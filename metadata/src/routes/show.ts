import express, { Request, Response } from 'express';
import { NotFoundError } from "@kurumkanimgproc/common";
import { Meta } from '../models/meta';

const router = express.Router();

router.get('/api/meta/:id', async(req: Request, res: Response) => {
    const meta = await Meta.findById(req.params.id);

    if (!meta) {
        throw new NotFoundError();
    }

    res.send(meta);
});

export { router as showMetaRouter };