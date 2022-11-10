const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const port = process.env.Port || 5000;
const app = express()
require('dotenv').config()

// Midelware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tcnszhx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'Unauthorized access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOCKEN, function (err, decoded) {
        if (err) {
            res.status(401).send({ message: 'Unauthorized access' })
        }
        req.decoded = decoded;
        next()
    })
}

function run() {
    try {
        const servicesCollection = client.db('lawServices').collection('services')
        const reviewCollection = client.db('lawServices').collection('review')
        
        app.post('/jwt', (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOCKEN, { expiresIn: '1d' })
            res.send({ token })
        })

        app.post('/services', async (req, res) => {
            const query = req.body;
            const service = await servicesCollection.insertOne(query)
            res.send(service)
        })

        app.get('/services', async (req, res) => {
            const query = {}
            console.log(query);
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/servicesall', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })

        // Review api
        app.post('/review', async (req, res) => {
            const query = req.body;
            const review = await reviewCollection.insertOne(query)
            res.send(review)
        })
        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.serviceId) {
                query = {
                    serviceId: req.query.serviceId
                }
            }

            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })
        app.get('/review', verifyJWT, async (req, res) => {
            const decoded = req.decoded
            if (decoded?.email !== req.query.email) {
                res.status(403).send({ message: 'unauthorized access' })
            }
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })

        app.put('/review/:id',async (req,res)=>{
            const id = req.params.id;
        const filter = { _id: ObjectId(id)}
        const user = req.body;
        const option = { upsert: true}
        const updateUser = {
            $set:{
               service: serviceName,
               message:message
            }
        }
        const result =await reviewCollection.updateOne(filter,updateUser,option)
        res.send(result)
        })


        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })

        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })
    } catch (error) {
        console.log(error);
    }
}
run()



app.get('/', (req, res) => {
    res.send('Alhudulillah Connected')
})

app.listen(port, () => {
    console.log('Service dimo', port);
})