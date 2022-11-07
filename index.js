const express = require('express')
const cors = require('cors')
const port = process.env.Port || 5000;
const app = express()
require('dotenv').config()

// Midelware
app.use(cors())
app.use(express.json())



app.get('/', (req,res)=>{
    res.send('Alhudulillah Connected')
})

app.listen(port, ()=>{
    console.log('Service dimo', port);
})