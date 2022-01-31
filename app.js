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

setInterval(async () => {
    try {
        const participants = await db.collection("participants").find({}).toArray();
        for (const participant of participants) {
            if (Date.now() - participant.lastStatus > 10000) {
                await db.collection('participants').deleteOne(participant);
                db.collection("messages").insertOne({
                    from: participant.name,
                    to: 'Todos',
                    text: 'sai da sala...',
                    type: 'status',
                    time: 'HH:mm:ss'
                })
            }
        }
    } catch {
        error.sendStatus(500);
    }
}, 15000);

//SCHEMAS
const participantSchema = joi.object({
    name: joi.string().required()
});

const messageSchema = joi.object({
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.valid("message", "private_message")
})

//PARTICIPANTS ROUTE
app.post("/participants", async (req, res) => {
    const validation = participantSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        res.sendStatus(422);
        return;
    }

    const duplicate = await db.collection("participants").findOne({ name: req.body.name });

    if (duplicate) {
        res.sendStatus(409);
        return;
    } else {
        try {
            db.collection("participants").insertOne({
                name: req.body.name, lastStatus: Date.now()
            });
            db.collection("messages").insertOne({
                from: req.body.name,
                to: 'Todos',
                text: 'entra na sala...',
                type: 'status',
                time: dayjs().format('HH:mm:ss')
            })
            res.sendStatus(201);
        } catch {
            error.sendStatus(500);
        }
    }
});

app.get("/participants", async (req, res) => {
    try {
        const allParticipants = await db.collection("participants").find().toArray();
        res.status(200).send(allParticipants);
    } catch {
        error.sendStatus(500);
    }
});

//MESSAGES ROUTE
app.post("/messages", (req, res) => {
    const validation = messageSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        res.sendStatus(422);
        return;
    }

    try {
        db.collection("messages").insertOne({
            from: req.header("User"),
            to: req.body.to,
            text: req.body.text,
            type: req.body.type,
            time: dayjs().format('HH:mm:ss')
        })
        res.sendStatus(201);
    } catch {
        error.sendStatus(500);
    }
});

app.get("/messages", async (req, res) => {
    try {
        const messages = await db.collection("messages").find({
            $or:
                [
                    { to: "Todos" },
                    { to: req.header("User") },
                    { from: req.header("User") }
                ]
        }).toArray();
        if (req.query.limit) {
            res.status(200).send(messages.slice(-parseInt(req.query.limit)));
        } else {
            res.status(200).send(messages);
        }
    } catch {
        error.sendStatus(500);
    }
});
app.delete("/messages/:id", (req, res) => {
    res.send('Delete not working yet');
});
app.put("/messages/:id", (req, res) => {
    res.send('Update not working yet');
});

//STATUS ROUTE
app.post("/status", async (req, res) => {
    try {
        const user = db.collection("participants").find({ name: req.header("User") });
        if (user) {
            await db.products.updateOne({
                name: user
            }, {
                $set: {
                    lastStatus: Date.now()
                }
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch {
        res.sendStatus(500);
    }
});

app.listen(process.env.PORT, () => {
    console.log('Server started at http://localhost:5000');
});