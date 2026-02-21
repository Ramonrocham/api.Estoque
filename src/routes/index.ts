import express from 'express';
import categoriaRouter from './categeoria.js';
import produtoRouter from './produto.js';
import pedidosRouter from './pedidos.js';

const router = express.Router();

router.use('/categoria', categoriaRouter);
router.use('/produto', produtoRouter);
router.use('/pedidos', pedidosRouter);

router.get('/ping', (req, res) => {
    res.send({'message': 'pong'});
});

export default router;