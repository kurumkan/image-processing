import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from "@kurumkanimgproc/common";
import { body } from 'express-validator';
import { Meta } from '../models/meta';

const router = express.Router();

router.post('/api/meta', requireAuth, [
        body('url')
            .not()
            .isEmpty()
            .withMessage('image url must be provided')
            .isURL()
            .withMessage('should be a valid url'),
        body('title')
            .not()
            .isEmpty()
            .withMessage('image title must be provided'),
        body('alt')
            .not()
            .isEmpty()
            .withMessage('image alt must be provided')
    ],
    validateRequest,
    async(req: Request, res: Response) => {
        const { userId, url, title, alt, lowsrc } = req.body;

        const meta = Meta.build({
            url,
            title,
            alt,
            lowsrc,
            userId: req.currentUser!.id
        });
        await meta.save();

        res.status(201).send(meta);
    }
);

export { router as newMetaRouter };