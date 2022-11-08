const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const port = process.env.Port || 5000;
const app = express()
require('dotenv').config()

// Midelware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tcnszhx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function run (){
    try {
        const servicesCollection = client.db('lawServices').collection('services')
        app.get('/services', async(req,res)=>{
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/servicesall', async(req,res)=>{
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
    } catch (error) {
        console.log(error);
    }
}
run()



app.get('/', (req,res)=>{
    res.send('Alhudulillah Connected')
})

app.listen(port, ()=>{
    console.log('Service dimo', port);
})