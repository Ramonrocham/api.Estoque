import type { ResultSetHeader } from "mysql2";
import type { categoria, createCategoriaDTO, updateCategoriaDTO } from "../types/categoria.types.js";
import con from "./connection.js";
import type { errorCreateResponse, successCreateResponse, sucessUpdateResponse, errorUpdateResponse } from "../types/index.types.js";

export function getCategorias(): Promise<categoria[]> {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM categoria', (err, result) => {
            if (err) {
                console.error('Erro ao buscar categorias:', err);
                resolve([]);
                return;
            }
            return resolve(result as categoria[]);
        });
    });
}

export function getCategoriaById(id: number): Promise <categoria[]>{
    return new Promise ((resolve, reject) => {
        con.query('SELECT * FROM CATEGORIA WHERE Id = ?',[id], (err, result) => {
            if (err) {
                console.error('Erro ao buscar categoria:', err);
                resolve([]);
                return;
            }

            return resolve(result as categoria[]);
        })
    })
}

export function createCategoria(categoria: createCategoriaDTO): Promise<successCreateResponse | errorCreateResponse> {
    return new Promise((resolve, reject) => {
        const { nome, descricao = null, status = 'ativo' } = categoria;

        con.query('INSERT INTO categoria (nome, descricao, status) VALUES (?, ?, ?)', [nome, descricao, status], (err, result) => {
            if (err) {
                console.error('Erro ao criar categoria:', err);
                resolve({
                    status: 'error',
                    message: 'Erro ao criar categoria'
                });
                return;
            }
            resolve({
                status: 'success',
                message: 'Categoria criada com sucesso',
                id: (result as any).insertId
            });
        });
    });
}

export function updateCategoria(updateData: updateCategoriaDTO, id: number): Promise<sucessUpdateResponse | errorUpdateResponse> {
    return new Promise((resolve, reject) => {
        const { nome, descricao, status } = updateData;
        const fields = [];
        const values = [];

        if (nome !== undefined) {
            fields.push('nome = ?');
            values.push(nome);
        }
        if (descricao !== undefined) {
            fields.push('descricao = ?');
            values.push(descricao);
        }
        if (status !== undefined) {
            fields.push('status = ?');
            values.push(status);
        }

        if (fields.length === 0) {
            resolve({
                statusRequest: 'error',
                message: 'Nenhum campo para atualizar'
            });
            return;
        }

        values.push(id);

        con.query(`UPDATE categoria SET ${fields.join(', ')} WHERE id = ?`, values, (err, result: ResultSetHeader ) => {
            if (err) {
                console.error('Erro ao atualizar categoria:', err);
                resolve({
                    statusRequest: 'error',
                    message: 'Erro ao atualizar categoria'
                });
                return;
            }
            if(result.affectedRows === 0) {
                resolve({
                    statusRequest: 'error',
                    message: 'Categoria não encontrada'
                });
                return;
            }
            resolve({
                statusRequest: 'success',
                message: 'Categoria atualizada com sucesso',
                id
            });
        });
    });
}

export function removeCategoria(id: number): Promise<successCreateResponse | errorCreateResponse> {
    return new Promise((resolve, reject) => {
        con.query('DELETE FROM categoria WHERE id = ?', [id], (err, result: ResultSetHeader ) => {
            if (err) {
                console.error('Erro ao deletar categoria:', err);
                resolve({
                    status: 'error',
                    message: 'Erro ao deletar categoria'
                });
                return;
            }
            if(result.affectedRows === 0) {
                resolve({
                    status: 'error',
                    message: 'Categoria não encontrada'
                });
            }
            resolve({
                status: 'success',
                message: 'Categoria deletada com sucesso',
                id
            });
        });
    });
}