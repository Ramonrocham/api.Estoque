import type { RequestHandler } from "express";

export const verifyIdIsNumber: RequestHandler = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(Number(id)) || Number(id) <= 0) {
        res.status(400).send({'error': 'Id deve ser um número positivo'});
        return;
    }
    next();
}