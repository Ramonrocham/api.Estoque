import type { RequestHandler } from "express";
import { getCategoriaById } from "../queries/categoria.query.js";

export const verifyIdIsNumber: RequestHandler = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(Number(id)) || Number(id) <= 0) {
        res.status(400).send({'error': 'Id deve ser um número positivo'});
        return;
    }
    next();
}

export const verifyQueryProduto: RequestHandler = (req, res, next) => {
    const { orderBy, order, limit, offset } = req.query;
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
    next();
}

export const verifyBodyNewProduto: RequestHandler = async (req, res, next) => {
    const { nome, descricao, preco, quantidade, status, categoria_id } = req.body;
    if(!nome){
        res.status(400).send({'error': 'Nome é obrigatório'});
    }
    if(!preco || preco <= 0){
        res.status(400).send({'error': 'Preço deve ser maior que 0'});
    }
    if(quantidade < 0){
        res.status(400).send({'error': 'Quantidade deve ser maior ou igual a 0'});
    }
    if(status && status !== 'ativo' && status !== 'inativo'){
        res.status(400).send({'error': 'Status deve ser "ativo" ou "inativo"'});
    }
    if(categoria_id !== undefined && categoria_id !== null) {
    if(isNaN(Number(categoria_id)) || Number(categoria_id) <= 0){
        res.status(400).send({'error': 'categoria_id deve ser um maior que 0'});
    }
    const categoriaExists = await getCategoriaById(Number(categoria_id));
    if(categoriaExists === null || categoriaExists[0] === undefined){
        res.status(400).send({'error': 'Categoria não encontrada'});
    }
    }

    next();
}

export const verifyBodyUpdateProduto: RequestHandler = async (req, res, next) => {
    const { nome, descricao, preco, status, categoria_id } = req.body;
    if(nome !== undefined && nome.trim() === ''){
        res.status(400).send({'error': 'Nome não pode ser vazio'});
    }
    if(preco !== undefined && preco <= 0){
        res.status(400).send({'error': 'Preço deve ser maior que 0'});
    }
    if(status !== undefined && status !== 'ativo' && status !== 'inativo'){
        res.status(400).send({'error': 'Status deve ser "ativo" ou "inativo"'});
    }
    if(categoria_id !== undefined && categoria_id !== null) {
        if(isNaN(Number(categoria_id)) || Number(categoria_id) <= 0){
            res.status(400).send({'error': 'categoria_id deve ser um maior que 0'});
        }
        const categoriaExists = await getCategoriaById(Number(categoria_id));
        if(categoriaExists === null || categoriaExists[0] === undefined){
            res.status(400).send({'error': 'Categoria não encontrada'});
        }
    }
    next();
}