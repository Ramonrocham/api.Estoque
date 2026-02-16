import express from 'express';
import categoriaRouter from './categeoria.js';

const router = express.Router();

router.use('/categoria', categoriaRouter);
router.get('/ping', (req, res) => {
    res.send({'message': 'pong'});
});

router.get('/', (req, res) => {
    res.send({'message': 'Hello, World!'});
});

export default router;