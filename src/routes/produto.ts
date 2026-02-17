import express from 'express';
import { createProduto, getProdutoById, getProdutos } from '../queries/produto.query.js';
import type { produto, queryProdutoDTO } from '../types/produto.types.js';
import { verifyBodyNewProduto, verifyIdIsNumber, verifyQueryProduto } from '../middlewares/index.middleware.js';

const router = express.Router();

router.get('/:id',verifyIdIsNumber, async (req, res) => {
    const {id} = req.params;
    const result = await getProdutoById(Number(id));
    if(result[0] === undefined) {
        res.status(404).send({'error': 'Categoria não encontrada'});
        return;
    }
    res.send({'produto': result[0]});
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

router.post('/',verifyBodyNewProduto, async (req, res) => {
    const { nome, descricao, preco,quantidade, status, categoria_id } = req.body;
    let newProduto ={}
    if(nome) newProduto = {...newProduto, nome};
    if(descricao) newProduto = {...newProduto, descricao};
    if(preco) newProduto = {...newProduto, preco};
    if(quantidade) newProduto = {...newProduto, quantidade};
    if(status) newProduto = {...newProduto, status};
    if(categoria_id) newProduto = {...newProduto, categoria_id: categoria_id};
    const result = await createProduto(newProduto as produto);
    res.send(result);
})

router.put('/:id',verifyIdIsNumber, async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, categoria_id } = req.body;
    res.send({'message': `Produto ${id} atualizado com sucesso`, nome, descricao, preco, categoria_id});
})

router.delete('/:id',verifyIdIsNumber, async (req, res) => {
    const { id } = req.params;
    res.send({'message': `Produto ${id} deletado com sucesso`});
})


export default router;