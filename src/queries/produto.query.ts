import { rejects } from "node:assert";
import type { messageCreateProdutoDTO, produto, queryProdutoDTO, updateProdutoDTO } from "../types/produto.types.js";
import con from "./connection.js"

export function getProdutos({orderBy = 'id', order = 'ASC', limit = 10, offset = 0}:queryProdutoDTO): Promise<produto[]> {
    return new Promise((resolve, reject) => {
        const sql =`
            SELECT id, nome, descricao, preco, quantidade, status, categoria_id 
            FROM produto 
            ORDER BY ${orderBy} ${order} 
            LIMIT ? OFFSET ?
        `
        con.query(sql, [limit, offset], (err, results) => {
            if (err) {
                console.error('Erro ao buscar produtos:', err);
                resolve([]);
                return;
            }
            resolve(results as produto[]);
        });
    })
}

export function getProdutoById(id: number): Promise<produto[]> {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM produto WHERE Id = ?', [id], (err, result) => {
            if (err) {
                console.error('Erro ao buscar produto:', err);
                resolve([]);
                return;
            }
            resolve(result as produto[]);
        });
    })
}

export function createProduto({ nome, descricao = null, preco, quantidade = 0, status = 'ativo', categoria_id = null }: produto): Promise<messageCreateProdutoDTO> {
    return new Promise((resolve, reject) => {
        let values = [nome, preco, quantidade, status];
        let campos = ['nome', 'preco', 'quantidade', 'status'];
        if (descricao) {
            values.push(descricao);
            campos.push('descricao');
        }
        if (categoria_id) {
            values.push(categoria_id);
            campos.push('categoria_id');
        }

        const sql = `INSERT INTO produto (${campos.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`; 
        con.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro ao criar produto:', err);
                resolve({ status: 'error', message: 'Erro ao criar produto' });
                return;
            }
            resolve({ status: 'success', message: 'Produto criado com sucesso', id: (result as any).insertId });
        });
    });
}

export function updateProduto ({nome, descricao, preco, status, categoria_id}: updateProdutoDTO, id: number): Promise<messageCreateProdutoDTO> {
    return new Promise ((resolve, rejects) => {
        const fields = [];
        const values = [];

        if(nome !== undefined) {
            fields.push('nome = ?');
            values.push(nome);
        }

        if(descricao !== undefined) {
            fields.push('descricao = ?');
            values.push(descricao);
        }

        if(preco !== undefined) {
            fields.push('preco = ?');
            values.push(preco);
        }

        if(status !== undefined) {
            fields.push('status = ?');
            values.push(status);
        }

        if(categoria_id !== undefined) {
            fields.push('categoria_id = ?');
            values.push(categoria_id);
        }

        if(fields.length === 0) {
            resolve({ status: 'error', message: 'Nenhum campo para atualizar' });
            return;
        }

        values.push(id);

        const sql = `UPDATE produto SET ${fields.join(', ')} WHERE id = ?`;

        con.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro ao atualizar produto:', err);
                resolve({ status: 'error', message: 'Erro ao atualizar produto' });
                return;
            }
            resolve({ status: 'success', message: 'Produto atualizado com sucesso' });
        });
    });
}
