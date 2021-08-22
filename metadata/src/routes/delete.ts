import express, { Request, Response } from 'express';
import { requireAuth, NotAuthorizedError, NotFoundError } from "@kurumkanimgproc/common";
import { Meta } from '../models/meta';

const router = express.Router();

router.delete('/api/meta/:id', requireAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    const meta = await Meta.findById(id);

    if (!meta) {
        throw new NotFoundError();
    }
    if (meta.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    await meta.remove();

    res.status(204).send(meta);
});

export { router as deleteMetaRouter };