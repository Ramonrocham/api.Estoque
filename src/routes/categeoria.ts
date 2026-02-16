import express from 'express';

const router = express.Router();

router.get('/:id', (req, res) => {
    
    const { id } = req.params;

    res.send({id, nome: 'Eletrônicos'})
});

router.get('/', (req, res) => {

    res.send({'categorias': [
        {
            "id": 1,
            "nome": "Eletrônicos"
        },
        {
            "id": 2,
            "nome": "Roupas"
        },
    ]})
})

router.post('/', (req, res) => {
    const { nome, descricao } = req.body;

    res.send(
        {
        status: 'success',
        message: 'Categoria criada com sucesso',
        id: 3,
        nome,
        descricao
    })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    res.send(
        {
        status: 'success',
        message: 'Categoria atualizada com sucesso',
        id,
        nome,
        descricao
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.send(
        {
        status: 'success',
        message: 'Categoria deletada com sucesso',
        id
    })
});

export default router;