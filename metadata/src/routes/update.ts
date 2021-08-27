import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
    BadRequestError
} from '@kurumkanimgproc/common';
import { Meta } from '../models/meta';

const router = express.Router();

router.put('/api/meta/:fileName', requireAuth, [
    body('lowsrc')
        .optional()
        .isURL()
        .withMessage('lowsrc must be a valid url')
], validateRequest, async (req: Request, res: Response) => {
    const meta = await Meta.findOne({ fileName: req.params.fileName });

    if(!meta) {
        throw new NotFoundError();
    }

    if(meta.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (!Object.keys(req.body).length) {
        throw new BadRequestError('lowsrc, alt or title must be provided');
    }

    const { title, lowsrc, alt } = req.body;

    if (title) {
        meta.set({ title });
    }

    if (lowsrc) {
        meta.set({ lowsrc });
    }

    if (alt) {
        meta.set({ alt });
    }

    await meta.save();

    res.send(meta);
});

export { router as updateMetaRouter };