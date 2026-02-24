import express from 'express';
import { verifyBodyNewPedido, verifyIdIsNumber, verifyQueryPedidos } from '../middlewares/index.middleware.js';
import { createPedidoEntrada, createPedidoSaida, getPedidoById, getPedidos } from '../queries/pedido.query.js';
import type { pedidosQueryDTO } from '../types/pedido.types.js';

const router = express.Router();

router.get('/:id',verifyIdIsNumber, async (req, res) => {
    const { id } = req.params;
    const result = await getPedidoById(Number(id));
    if(result[0] === undefined) {
        res.status(404).send({'error': 'Pedido não encontrado'});
        return;
    }
    res.send({'pedido': result[0]});
})

router.get('/',verifyQueryPedidos, async (req, res) => {
    const { tipo, status, order, limit, offset } = req.query;
    let query = {};
    if(tipo) query = {...query, tipo: String(tipo)};
    if(status) query = {...query, status: [String(status)]};
    if(order) query = {...query, order: String(order)};
    if(limit) query = {...query, limit: Number(limit)};
    if(offset) query = {...query, offset: Number(offset)};
    const pedidos = await getPedidos(query as pedidosQueryDTO);
    if(pedidos === null) {
        res.status(500).send({'error': 'Erro ao buscar pedidos'});
        return;
    }

    res.send({'pedidos': pedidos});
})

router.post('/',verifyBodyNewPedido, async (req, res) => {
    const { tipo, produtos } = req.body;
    if(tipo === 'entrada') {
        const result = await createPedidoEntrada(produtos);
        if(result.status === 'error') {
            res.status(400).send(result);
            return;
        }
        res.send(result);
        return;
    }
    const result = await createPedidoSaida(produtos);
    if(result.status === 'error') {
        res.status(400).send(result);
        return;
    }
    res.send(result);
})

export default router;