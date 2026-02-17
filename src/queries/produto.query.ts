import type { produto, queryProdutoDTO } from "../types/produto.types.js";
import con from "./connection.js"

export function getProdutos({orderBy = 'Id', order = 'ASC', limit = 10, offset = 0}:queryProdutoDTO): Promise<produto[]> {
    return new Promise((resolve, reject) => {
        const sql =`
            SELECT id, nome, descricao, preco, quantidade, status, categoria_Id 
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
            console.log(results)
            resolve(results as produto[]);
        });
    })
}