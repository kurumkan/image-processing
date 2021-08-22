import express, {Request, Response} from 'express';
import { requireAuth } from "@kurumkanimgproc/common";
import { Meta } from '../models/meta';

const router = express.Router();

router.get('/api/meta', requireAuth, async(req: Request, res: Response) => {
    const data = await Meta.find({
        userId: req.currentUser!.id
    });

    res.status(200).send(data);
});

export { router as indexMetaRouter };