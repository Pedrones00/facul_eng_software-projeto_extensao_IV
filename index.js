import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';
import { setupSwagger } from './src/config/swagger.js';
import { webcrypto } from 'crypto';
import 'dotenv/config';

globalThis.crypto = webcrypto;

const app = express();

app.use(express.json());
app.use(cors());

setupSwagger(app);

routes(app).then(() => {
    app.use((request, response) => {
        response.redirect('/docs');
    });

    app.listen(process.env.NODE_PORT, () => {
        console.log(`Servidor rodando no endereço http://localhost:${process.env.NODE_PORT}`);
    });
});