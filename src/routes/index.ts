import express from 'express';
import categoriaRouter from './categeoria.js';
import produtoRouter from './produto.js';

const router = express.Router();

router.use('/categoria', categoriaRouter);
router.use('/produto', produtoRouter);

router.get('/ping', (req, res) => {
    res.send({'message': 'pong'});
});

export default router;