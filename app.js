import express, { json } from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';

dotenv.config();
const app = express();
app.use(json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db("bate-papo-UOL_DB");
});

//SCHEMAS
const participantSchema = joi.object({
    name: joi.string().required()
});

//PARTICIPANTS ROUTE
app.post("/participants", async (req, res) => {
    const validation = participantSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        res.sendStatus(422);
        return;
    }

    const duplicate = await db.collection("participants").findOne({name: req.body.name});

    if(duplicate){
        res.sendStatus(409);
        return;
    }else{
        try{
            db.collection("participants").insertOne({
                name: req.body.name, lastStatus: Date.now()
            });
            db.collection("messages").insertOne({
                from: req.body.name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format('hh:mm:ss')
            })
            res.sendStatus(201);
        }catch{
            error.sendStatus(500);
        }
    }
    
});

app.get("/participants", (req, res) => {
    res.send('Server is Running');
});

//MESSAGES ROUTE
app.post("/messages", (req, res) => {
    res.send('Server is Running');
});
app.get("/messages", (req, res) => {
    res.send('Server is Running');
});
app.delete("/messages/:id", (req, res) => {
    res.send('Server is Running');
});
app.put("/messages/:id", (req, res) => {
    res.send('Server is Running');
});

//STATUS ROUTE
app.post("/status", (req, res) => {
    res.send('Server is Running');
});

app.listen(process.env.PORT, () => {
    console.log('Server started at http://localhost:5000');
});