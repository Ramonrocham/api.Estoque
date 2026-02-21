import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFoundRequest: RequestHandler = (req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Endpoint não encontrado'
    });
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log('Error:', err);
    res.status(500).send({
        status: 'error',
        message: 'Ocorreu um erro interno no servidor'
    });
}