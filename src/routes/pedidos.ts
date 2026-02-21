import express from 'express';
import { verifyBodyNewPedido } from '../middlewares/index.middleware.js';
import { createPedidoEntrada } from '../queries/pedido.query.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    res.send({'pedido': `Pedido ${id}`});
})

router.get('/', async (req, res) => {
    res.send({'pedidos': 'Lista de pedidos'});
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
    }
})

export default router;