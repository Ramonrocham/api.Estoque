export type successCreateResponse = {
    status: 'success',
    message: string,
    id: number
}

export type errorCreateResponse = {
    status: 'error',
    message: string
}