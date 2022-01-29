import express from 'express';
import cors from 'cors';

const serv = express();
serv.use(express.json());
serv.use(cors());

serv.get("/", (req, res) => {
    res.send('Hello World');
});

serv.listen(5000);