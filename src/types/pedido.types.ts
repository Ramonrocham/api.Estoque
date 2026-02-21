export type pedido = {
    produtos: {
            id: number,
            quantidade: number
        }[],
    tipo: 'entrada' | 'saida'
}

export type produtoByDB = {
    Id?: number,
    Nome?: string,
    Descricao?: string | null,
    Preco?: number,
    Quantidade?: number,
    Status?: 'ativo' | 'inativo',
    Categoria_id?: number | null
}