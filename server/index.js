const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config();
const cors = require('cors');

const { waiting_list,
    ongoing_matches_list,
    requests_list,
    waiting_lock,
    ongoing_matches_lock} = require('./data_models');
const eventemmiter = require('./event');
const dbconnect = require('./dbconnect');


const app = express();

const port = process.env.PORT||9310; 
app.use(cors({
    origin: "*",
    methods:["GET","POST"],
    credentials:true,
    // allowedHeaders:true
}));
const server = createServer(app);
module.exports.io = new Server(server,{
    cors:{
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
        credentials: true,
        // allowedHeaders:true,
        
    }
});

require('./socket')



app.get('/wakeup',(req,res)=>{
    res.send()
})

app.get('/', (req, res) => {
    res.send('working');
});

(async()=>{
    await dbconnect();
    server.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    });
})()
