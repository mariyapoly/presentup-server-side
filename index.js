const express = require('express');
const app = express();
require('dotenv').config();
var cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pgqwc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("presentUpManagement");
        const serviceCollection = database.collection("services");
        const userCollection = database.collection("users");

        // get 3 services from all service
        app.get('/services', async (req, res) => {
            const query = serviceCollection.find({});
            const result = await query.limit(3).toArray();
            res.send(result)
        })
        // get 3 services from all service
        app.get('/allServices', async (req, res) => {
            const query = serviceCollection.find({});
            const result = await query.toArray();
            res.send(result)
        })
        // get single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })

        // saved user
        app.post('/users', async (req, res) => {
            const query = req.body;
            const result = await userCollection.insertOne(query);
            res.json(result);
        })








    } finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('presentup server running')
})

app.listen(port, () => {
    console.log('presentup server running port', port)
})