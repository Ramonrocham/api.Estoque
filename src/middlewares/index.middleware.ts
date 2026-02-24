import type { RequestHandler } from "express";
import { getCategoriaById } from "../queries/categoria.query.js";
import type { pedido } from "../types/pedido.types.js";
import { existProdutosByIds, getQuantidadeByProdutoId } from "../queries/pedido.query.js";

export const verifyIdIsNumber: RequestHandler = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(Number(id)) || Number(id) <= 0) {
        res.status(400).send({'error': 'Id deve ser um número positivo'});
        return;
    }
    next();
}

export const verifyQueryProduto: RequestHandler = (req, res, next) => {
    const { orderBy, order, limit, offset, categoria_id, status } = req.query;
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

    if(status && !['ativo', 'inativo'].includes(String(status).toLowerCase())) {
        res.status(400).send({'error': 'status deve ser "ativo" ou "inativo"'});
        return;
    }

    if (categoria_id !== undefined) {
        if(isNaN(Number(categoria_id)) || Number(categoria_id) < 0){
            res.status(400).send({'error': 'categoria_id deve ser um número maior ou igual que 0'});
            return;
        }
    }
    next();
}

export const verifyBodyNewProduto: RequestHandler = async (req, res, next) => {
    const { nome, descricao, preco, quantidade, status, categoria_id } = req.body;
    if(!nome){
        res.status(400).send({'error': 'Nome é obrigatório'});
        return;
    }
    if(!preco || preco <= 0){
        res.status(400).send({'error': 'Preço deve ser maior que 0'});
        return;
    }
    if(quantidade < 0){
        res.status(400).send({'error': 'Quantidade deve ser maior ou igual a 0'});
        return;
    }
    if(status && status !== 'ativo' && status !== 'inativo'){
        res.status(400).send({'error': 'Status deve ser "ativo" ou "inativo"'});
        return;
    }
    if(categoria_id !== undefined && categoria_id !== null) {
    if(isNaN(Number(categoria_id)) || Number(categoria_id) <= 0){
        res.status(400).send({'error': 'categoria_id deve ser um maior que 0'});
        return;
    }
    const categoriaExists = await getCategoriaById(Number(categoria_id));
    if(categoriaExists === null || categoriaExists[0] === undefined){
        res.status(400).send({'error': 'Categoria não encontrada'});
        return;
    }
    }

    next();
}

export const verifyBodyUpdateProduto: RequestHandler = async (req, res, next) => {
    const { nome, descricao, preco, status, categoria_id } = req.body;
    if(nome !== undefined && nome.trim() === ''){
        res.status(400).send({'error': 'Nome não pode ser vazio'});
        return;
    }
    if(preco !== undefined && preco <= 0){
        res.status(400).send({'error': 'Preço deve ser maior que 0'});
        return;
    }
    if(status !== undefined && status !== 'ativo' && status !== 'inativo'){
        res.status(400).send({'error': 'Status deve ser "ativo" ou "inativo"'});
        return;
    }
    if(categoria_id !== undefined && categoria_id !== null) {
        if(isNaN(Number(categoria_id)) || Number(categoria_id) <= 0){
            res.status(400).send({'error': 'categoria_id deve ser um maior que 0'});
            return;
        }
        const categoriaExists = await getCategoriaById(Number(categoria_id));
        if(categoriaExists === null || categoriaExists[0] === undefined){
            res.status(400).send({'error': 'Categoria não encontrada'});
            return;
        }
    }
    next();
}

export const verifyBodyNewPedido: RequestHandler = async (req, res, next) => {
    const {produtos, tipo} = req.body as pedido;
    
    if(tipo !== 'entrada' && tipo !== 'saida') {
        res.status(400).send({'error': "'tipo' deve ser 'entrada' ou 'saida'"});
        return;
    }

    if(!produtos || !Array.isArray(produtos) || produtos.length === 0) {
        res.status(400).send({'error': "'produtos' deve ser um array não vazio"});
        return;
    }
    
    for (const produto of produtos) {
        if (
            (!produto.id || isNaN(Number(produto.id)) || Number(produto.id) <= 0) ||
            (!produto.quantidade || isNaN(Number(produto.quantidade)) || Number(produto.quantidade) <= 0)
        ) {
            return res.status(400).send({
                error: "Cada produto deve ter 'id' e 'quantidade' válidos"
            });
        }
    }

    let produtoIds = produtos.map(p => p.id);

    if(tipo === 'entrada') {
        const produtosDB = await existProdutosByIds(produtoIds);
        if(produtosDB.length !== produtoIds.length) {
            return res.status(400).send({
                error: "Um ou mais produtos não existem"
            });
        }
        next();
        return;
    }
    
    const quantidadeByProdutoId = await getQuantidadeByProdutoId(produtoIds);

    const dbMap = new Map(
        quantidadeByProdutoId.map(p => [p.id, p.quantidade])
    );

    for (const produto of produtos) {
        const quantidadeDB = dbMap.get(produto.id);

        if (quantidadeDB === undefined) {
            return res.status(400).json({
                error: `Produto com id ${produto.id} não existe`
            });
        }

        if (produto.quantidade > quantidadeDB) {
            return res.status(400).json({
                error: `Produto ${produto.id} tem ${quantidadeDB} produto(s) em estoque`
            });
        }
    }
        
    next();
}

export const verifyQueryPedidos: RequestHandler = (req, res, next) => {
    const { tipo, status, order, limit, offset } = req.query;
    const validStatus = ['processando', 'concluido', 'cancelado'];
    const validOrder = ['ASC', 'DESC'];
    
    if (tipo && tipo !== 'entrada' && tipo !== 'saida') {
        res.status(400).send({'error': "'tipo' deve ser 'entrada' ou 'saida'"});
        return;
    }
    if (status && !validStatus.includes(String(status).toLowerCase())) {
        res.status(400).send({'error': "'status' deve ser 'processando', 'concluido' ou 'cancelado'"});
        return;
    }
    if (order && !validOrder.includes(String(order).toUpperCase())) {
        res.status(400).send({'error': "'order' deve ser 'ASC' ou 'DESC'"});
        return;
    }
    if (limit && (isNaN(Number(limit)) || Number(limit) <= 0)) {
        res.status(400).send({'error': "'limit' deve ser um número maior que 0"});
        return;
    }
    if (offset && (isNaN(Number(offset)) || Number(offset) < 0)) {
        res.status(400).send({'error': "'offset' deve ser um número maior ou igual a 0"});
        return;
    }
    next();
}