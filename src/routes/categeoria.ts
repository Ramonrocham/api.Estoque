import express from 'express';
import { createCategoria, getCategoriaById, getCategorias } from '../queries/categoria.query.js';
import { verifyIdIsNumber } from '../middlewares/index.middleware.js';
import type { createCategoriaDTO } from '../types/categoria.types.js';

const router = express.Router();

router.get('/:id',verifyIdIsNumber, async (req, res) => {
    const { id } = req.params;

    const result = await getCategoriaById(Number(id));
    if(result[0] === undefined) {
        res.status(404).send({'error': 'Categoria não encontrada'});
        return;
    }
    res.send(result[0]);
});

router.get('/', async (req, res) => {
    const result = await getCategorias();
    if(result === null) {
        res.status(500).send({'error': 'Erro ao buscar categorias'});
        return;
    }
    res.send({'categorias': result});
})

router.post('/', async (req, res) => {
    const { nome, descricao, status } = req.body as createCategoriaDTO;

    if(!nome) {
        res.status(400).send({'error': 'Nome é obrigatório'});
        return;
    }
    
    const result = await createCategoria({ nome, descricao, status });
    if(result.status === 'error') {
        res.status(400).send(result);
        return;
    }
    res.send(result);
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    res.send(
        {
        status: 'success',
        message: 'Categoria atualizada com sucesso',
        id,
        nome,
        descricao
    })
})

router.delete('/:id', verifyIdIsNumber, (req, res) => {
    const { id } = req.params;
    res.send(
        {
        status: 'success',
        message: 'Categoria deletada com sucesso',
        id
    })
});

export default router;