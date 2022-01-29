import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("bate-papo-UOL_DB");
});
const serv = express();
serv.use(express.json());
serv.use(cors());

serv.get("/", (req, res) => {
    res.send('Server is Running');
});

//POSTS

serv.post("/participants", (req, res) => {
    res.send('Server is Running');
});

serv.post("/messages", (req, res) => {
    res.send('Server is Running');
});

serv.post("/status", (req, res) => {
    res.send('Server is Running');
});

//GETS

serv.get("/participants", (req, res) => {
    res.send('Server is Running');
});

serv.get("/messages", (req, res) => {
    res.send('Server is Running');
});

//DELETES

serv.delete("/messages/:id", (req, res) => {
    res.send('Server is Running');
});

//PUTS

serv.put("/messages/:id", (req, res) => {
    res.send('Server is Running');
});

serv.listen(process.env.PORT, () => {
    console.log('Servidor iniciado em http://localhost:5000')
  });