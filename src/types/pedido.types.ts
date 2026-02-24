export type pedido = {
    produtos: {
            id: number,
            quantidade: number
        }[],
    tipo: 'entrada' | 'saida'
}

export type pedidosDB = {
    id: number,
    tipo: "entrada" | "saida",
    status: "concluido" | "cancelado" | "processando",
    produto_id: number []
}

export type pedidosQueryDTO = {
    tipo?: null,
    status?: ['processando', 'concluido', 'cancelado'],
    order?: 'ASC' | 'DESC',
    limit?: number, 
    offset?: number
}