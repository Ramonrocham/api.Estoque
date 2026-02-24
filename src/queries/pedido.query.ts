import type {pedido, pedidosDB, pedidosQueryDTO } from "../types/pedido.types.js";
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
                con.query("UPDATE pedido SET status = 'cancelado' where id = ?", [pedidoId], (err, result) => {
                    if (err) {
                        reject({ status: "error", message: "Erro ao finalizar pedido" });
                        return;
                    }

                });
                reject({ status: "error", message: "Erro ao atualizar quantidade dos produtos" });
                return;
            }
            con.query("UPDATE pedido SET status = 'concluido' where id = ?", [pedidoId], (err, result) => {
                if (err) {
                    reject({ status: "error", message: "Erro ao finalizar pedido" });
                    return;
                }

            });
            resolve({ status: "success", message: "Pedido criado com sucesso", id: pedidoId });
            });
        });
    });
}

export function createPedidoSaida(produtos: pedido['produtos']): Promise<{ status: string, message: string, id?: number }> {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO pedido (tipo) VALUES ('saida')`;
        con.query(sql, async (err, result) => {
            if (err) {
                reject({ status: "error", message: "Erro ao criar pedido" });
                return;
            }
        const pedidoId = (result as any).insertId;
        const preco = await getPrecoByProdutosId(produtos.map(p => p.id));
        
        const precoMap = new Map(preco.map(p => [p.id, p.preco]));
        const values = produtos.map(p => [pedidoId, p.id, p.quantidade, precoMap.get(p.id) || 0]);
        const sqlProdutos = `INSERT INTO pedido_produto (pedido_id, produto_id, quantidade_produto, preco_unitario) VALUES ?`;
        con.query(sqlProdutos, [values], (err, result) => {
            if (err) {
                reject({ status: "error", message: "Erro ao associar produtos ao pedido" });
                return;
            }
        });
        const ids = produtos.map(p => p.id).join(",");

        const cases = produtos
        .map(p => `WHEN ${p.id} THEN quantidade - ${p.quantidade}`)
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
                con.query("UPDATE pedido SET status = 'cancelado' where id = ?", [pedidoId], (err, result) => {
                    if (err) {
                        reject({ status: "error", message: "Erro ao finalizar pedido" });
                        return;
                    }

                });
                reject({ status: "error", message: "Erro ao atualizar quantidade dos produtos" });
                return;
            }
            con.query("UPDATE pedido SET status = 'concluido' where id = ?", [pedidoId], (err, result) => {
                if (err) {
                    reject({ status: "error", message: "Erro ao finalizar pedido" });
                    return;
                }

            });
            resolve({ status: "success", message: "Pedido criado com sucesso", id: pedidoId });
            });
        });
    });
}

function getPrecoByProdutosId(ids: number[]): Promise<{id: number, preco: number}[]> {
    return new Promise((resolve, reject) => {
        con.query("SELECT id, preco FROM produto WHERE id IN (" + ids.join(",") + ")", (err, result) => {
             if (err) {
                reject(err);
            } 
            resolve(result as {id: number, preco: number}[]);
        });
    });
}

export function getPedidos({tipo = null, status = ['processando', 'concluido', 'cancelado'], order = 'ASC', limit = 10, offset = 0}: pedidosQueryDTO): Promise<pedidosDB[]> {
    return new Promise ((resolve, rejects) => {
        let whereClause = `WHERE status IN ('${status.join("','")}')`;
        if(tipo !== null) {
            whereClause += ` AND tipo = '${tipo}'`;
        }
        const sqlPedido = `
        Select ped.id, ped.tipo, ped.status,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', prod.produto_id,
                'quantidade', prod.quantidade_produto,
                'preco', prod.preco_unitario
            )
        ) AS produtos
        from pedido ped
        join pedido_produto prod on ped.id = prod.pedido_id
        ${whereClause}
        GROUP BY ped.id, ped.tipo, ped.status
        order by ped.id ${order}
        limit ${limit} offset ${offset}
        `;
        con.query(sqlPedido, (err, result) => {
            if(err) {
                rejects(err);
            }
            resolve(result as pedidosDB[]);
        })
    })
}

export function getPedidoById(id: number): Promise<pedidosDB[]> {
    return new Promise ((resolve, rejects) => {
        const sqlPedido = `
        Select ped.id, ped.tipo, ped.status, ped.create_at,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', prod.produto_id,
                'quantidade', prod.quantidade_produto,
                'preco', prod.preco_unitario
            )
        ) AS produtos
        from pedido ped
        join pedido_produto prod on ped.id = prod.pedido_id
        WHERE ped.id = ${id}
        GROUP BY ped.id, ped.tipo, ped.status
        `;

        con.query(sqlPedido, (err, result) => {
            if(err) {
                rejects(err);
            }
            resolve(result as pedidosDB[]);
        });
    })
}