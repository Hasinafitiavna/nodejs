import express, { Request, Response } from "express";

const router = express.Router();

router.get("/getAllUtilisateur", async (req: Request, res: Response) => {
    res.send("salut a");
});

export default router;