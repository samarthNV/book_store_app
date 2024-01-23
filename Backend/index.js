import express, { response } from "express";
import { PORT, MongoURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js"

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req);
    return res.status(234).send('Namaste Duniya');
});

app.post('/books', async (req, res) => {
    try {
        if(!req.body.title || !req.body.author || !req.body.publishYear){
            return res.status(400).send({message: "Send all the required fields."});
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        }
        const book = await Book.create(newBook);
        return res.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message : error.message});
    }
})

app.get('/books/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const books = await Book.findById(id);
        return res.status(200).json(books);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message : error.message});
    }
})

mongoose.connect(MongoURL, {
    dbName: "BookStore",
})
.then(() => {
    console.log("Database connected.");
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
})