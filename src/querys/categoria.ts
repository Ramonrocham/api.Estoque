import con from "./connection.js";

export function getCategorias(): Promise<any | null> {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM categoria', (err, result) => {
            if (err) {
                console.error('Erro ao buscar categorias:', err);
                resolve(null);
                return;
            }
            return resolve(result);
        });
    });
}