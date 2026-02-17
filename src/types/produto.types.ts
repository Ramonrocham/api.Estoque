export type produto = {
    id: number,
    nome: string,
    descricao: string,
    preco: number,
    quantidade: number,
    status: 'ativo' | 'desativo',
    categoria_Id: number
}

export type queryProdutoDTO = {
    orderBy?: 'Id' | 'nome' | 'preco' | 'quantidade' | 'status' | 'categoria_Id',
    order?: 'ASC' | 'DESC',
    limit?: number,
    offset?: number
}