import express from 'express';
import { getCategorias } from '../querys/categoria.js';

const router = express.Router();

router.get('/:id', (req, res) => {
    
    const { id } = req.params;

    res.send({id, nome: 'Eletrônicos'})
});

router.get('/', async (req, res) => {
    const result = await getCategorias();
    if(result === null) {
        res.status(500).send({'error': 'Erro ao buscar categorias'});
        return;
    }
    res.send({'categorias': result});
})

router.post('/', (req, res) => {
    const { nome, descricao } = req.body;

    res.send(
        {
        status: 'success',
        message: 'Categoria criada com sucesso',
        id: 3,
        nome,
        descricao
    })
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

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.send(
        {
        status: 'success',
        message: 'Categoria deletada com sucesso',
        id
    })
});

export default router;