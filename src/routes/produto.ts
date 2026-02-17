import express from 'express';
import { getProdutos } from '../queries/produto.query.js';
import type { queryProdutoDTO } from '../types/produto.types.js';
import { verifyIdIsNumber, verifyQueryProduto } from '../middlewares/index.middleware.js';

const router = express.Router();

router.get('/:id',verifyIdIsNumber, async (req, res) => {
    const {id} = req.params;
    res.send({'message': `Produto ${id}`});
})

router.get('/',verifyQueryProduto, async (req, res) => {
    const { orderBy, order, limit, offset } = req.query;
    let query = {};
    if(orderBy) query = {...query, orderBy: String(orderBy)};
    if(order) query = {...query, order: String(order)};
    if(limit) query = {...query, limit: Number(limit)};
    if(offset) query = {...query, offset: Number(offset)};

    const result = await getProdutos(query as queryProdutoDTO);

    if(result === null) {
        res.status(500).send({'error': 'Erro ao buscar produtos'});
        return;
    }
    res.send({'produtos': result});
})

router.post('/', async (req, res) => {
    const { nome, descricao, preco, categoria_Id } = req.body;
    res.send({'message': 'Produto criado com sucesso', nome, descricao, preco, categoria_Id});
})

router.put('/:id',verifyIdIsNumber, async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, categoriaId } = req.body;
    res.send({'message': `Produto ${id} atualizado com sucesso`, nome, descricao, preco, categoriaId});
})

router.delete('/:id',verifyIdIsNumber, async (req, res) => {
    const { id } = req.params;
    res.send({'message': `Produto ${id} deletado com sucesso`});
})


export default router;