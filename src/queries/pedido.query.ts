import type { pedido } from "../types/pedido.types.js";
import con from "./connection.js"

export function getQuantidadeByProdutoId(ids:number[]): Promise<{id: number, quantidade: number}[]> {
    return new Promise((resolve, reject) => {
        con.query("SELECT id, quantidade FROM produto WHERE id IN (" + ids.join(",") + ")", (err, result) => {
            if (err) {
                reject(err);
            } 
            resolve(result as {id: number, quantidade: number}[]);
        });
    });
}

export function existProdutosByIds(ids: number[]): Promise<{id: number}[]> {
    return new Promise((resolve, reject) => {
        con.query("SELECT id FROM produto WHERE id IN (" + ids.join(",") + ")", (err, result) => {
            if (err) {
                reject(err);
            } 
            resolve(result as {id: number}[]);
        });
    });
}

export function createPedidoEntrada(produtos: pedido['produtos']): Promise<{ status: string, message: string, id?: number }> {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO pedido (tipo) VALUES ('entrada')`;
        con.query(sql, (err, result) => {
            if (err) {
                reject({ status: "error", message: "Erro ao criar pedido" });
                return;
            }
        const pedidoId = (result as any).insertId;
        const values = produtos.map(p => [pedidoId, p.id, p.quantidade, 0]);
        const sqlProdutos = `INSERT INTO pedido_produto (pedido_id, produto_id, quantidade_produto, preco_unitario) VALUES ?`;
        con.query(sqlProdutos, [values], (err, result) => {
            if (err) {
                reject({ status: "error", message: "Erro ao associar produtos ao pedido" });
                return;
            }
        });
        const ids = produtos.map(p => p.id).join(",");

        const cases = produtos
        .map(p => `WHEN ${p.id} THEN quantidade + ${p.quantidade}`)
        .join(" ");

        const sqlAtualizarProdutos = `
        UPDATE produto
        SET quantidade = CASE id
            ${cases}
        END
        WHERE id IN (${ids})
        `;

        con.query(sqlAtualizarProdutos, (err, result) => {
            if (err) {
                reject({ status: "error", message: "Erro ao atualizar quantidade dos produtos" });
                return;
            }
            resolve({ status: "success", message: "Pedido criado com sucesso", id: pedidoId });
        });
        
        });
    });
}

