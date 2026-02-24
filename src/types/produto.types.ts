export type produto = {
    id?: number,
    nome: string,
    descricao: string | null,
    preco: number,
    quantidade: number,
    status: 'ativo' | 'inativo',
    categoria_id: number | null
}

export type queryProdutoDTO = {
    orderBy?: 'id' | 'nome' | 'preco' | 'quantidade' | 'status' | 'categoria_id',
    order?: 'ASC' | 'DESC',
    limit?: number,
    offset?: number,
    categoria_id?: number | null
    status?: ('ativo' | 'inativo')[]
}

export type messageCreateProdutoDTO = {
    status: string,
    message: string,
    id?: number
}

export type updateProdutoDTO = {
    nome?: string,
    descricao?: string,
    preco?: number,
    status?: 'ativo' | 'inativo',
    categoria_id?: number | null
}