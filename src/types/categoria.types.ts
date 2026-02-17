export type categoria ={ 
    id: number,
    nome: string,
    descricao: string,
    status: string
}

export type createCategoriaDTO = {
    nome: string,
    descricao: string | null,
    status: 'ativo' | 'desativo' | null
}

export type updateCategoriaDTO = {
    nome?: string,
    descricao?: string,
    status?: 'ativo' | 'desativo'
}