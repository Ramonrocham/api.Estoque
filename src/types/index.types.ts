export type successCreateResponse = {
    status: 'success',
    message: string,
    id: number
}

export type errorCreateResponse = {
    status: 'error',
    message: string
}

export type sucessUpdateResponse = {
    statusRequest: 'success',
    message: string,
    id: number
}

export type errorUpdateResponse = {
    statusRequest: 'error',
    message: string
}