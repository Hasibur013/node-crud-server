const express = require('express')
const { MongoClient, Collection } = require('mongodb');
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

const port = 5000;

// User-   mydbuser1
// Pass-  1yKUPL4Tyvk7T2RJ


// midleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://mydbuser1:1yKUPL4Tyvk7T2RJ@cluster0.towtc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//     const collection = client.db("Heroin").collection("naika");
//     // perform actions on the collection object
//     console.log('hitting the database');

//     const user = { name: 'Hero alam', email: 'hero@gmail.com', phone: '019000999' };
//     collection.insertOne(user)
//         .then(() => {
//             console.log('insert success');
//         })

//     //   client.close();
// });

// or async method
async function run() {
    try {
        await client.connect();
        const database = client.db('Heroin');
        const usersCollection = database.collection('users');

        // get api

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // for update user

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query)
            console.log('load users with id', user);
            res.send(user)
        })

        // create a document to insert
        //   const doc = {
        //     name: "Special one",
        //     email: "spacial@hotmail.com",
        //   }
        //   const result = await usersCollection.insertOne(doc);
        //   console.log(`A document was inserted with the _id: ${result.insertedId}`);


        // post api

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);

            console.log('got user', req.body);
            console.log('added user', result);

            res.json(result);
        })

        // update api

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)

            console.log('update an id', req);
            res.json(result)
        })

        // delete api

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)


            console.log('deleteing user with id', result);
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running my crud server')
})

app.listen(port, () => {
    console.log('running server on port', port);
})