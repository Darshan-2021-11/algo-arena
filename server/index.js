const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT||9310; 
app.use(cors({
    origin: process.env.ORIGIN
}));
const server = createServer(app);
module.exports.io = new Server(server,{
    cors:{
        origin: process.env.ORIGIN, 
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

require('./socket')

app.get('/wakeup',(req,res)=>{
    res.send()
})

app.get('/', (req, res) => {
    res.send('working');
});

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});