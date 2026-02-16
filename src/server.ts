import express from 'express';
import helmet from 'helmet';
import router from './routes/index.js';

const server = express();

server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use('/api/v1', router);

server.get('/', (req, res) => {
    res.send({'message': 'Welcome to the Stock Management API!'});
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});