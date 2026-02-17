import type { RequestHandler } from "express";

export const verifyIdIsNumber: RequestHandler = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(Number(id)) || Number(id) <= 0) {
        res.status(400).send({'error': 'Id deve ser um número positivo'});
        return;
    }
    next();
}

export const verifyQueryProduto: RequestHandler = (req, res, next) => {
    const { orderBy, order, limit, offset } = req.query;
    const validOrderBy = ['id', 'nome', 'preco', 'quantidade', 'status', 'categoria_id'];
    const validOrder = ['ASC', 'DESC'];
    if (orderBy && !validOrderBy.includes(String(orderBy).toLowerCase())) {
        res.status(400).send({'error': `orderBy deve ser um dos seguintes valores: ${validOrderBy.join(', ')}`});
        return;
    }
    
    if (limit && isNaN(Number(limit))) {
        res.status(400).send({'error': 'limit deve ser um número'});
        return;
    }
    
    if (offset && isNaN(Number(offset))) {
        res.status(400).send({'error': 'offset deve ser um número'});
        return;
    }

    if (order && !validOrder.includes(String(order))) {
        res.status(400).send({'error': `order deve ser um dos seguintes valores: ${validOrder.join(', ')}`});
        return;
    }
    next();
}