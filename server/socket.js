const { io } = require('.');
const { users, userToken, list } = require('./data_models');
const { startMatch, listMatch, joinMatch, surrender, cancelMatch, submit } = require("./socket_methods");
const jwt = require("jsonwebtoken");
const cookie = require('cookie');

// what if token expires mid match ?

io.use(async (socket, next) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("Server configuration failed.");
        }
        const t = socket.handshake.headers.cookie;
        const cookies = cookie.parse(t || "");
        const token = cookies.token;
        if (!token) {
            throw new Error("Unauthorized access.")
        }

        const decodedtoken = jwt.verify(token, secret);
        const existingUser = userToken.get(decodedtoken.id);
        if(existingUser){
            const userdata = users.get(existingUser);
            if(userdata.online){
                throw new Error("Unauthorized access.")
            }
            userToken.set(decodedtoken.id,socket.id);
            users.delete(existingUser);
            userdata.online = true;
            users.set(socket.id,userdata);
            if(userdata.roomid){
                const room = list.get(userdata.roomid);
                if(room.mems.length === 1){
                    socket.emit("created", { roomid:userdata.roomid, message: "Logged in successfully." });

                }
                socket.emit("login",)
            }
        }
        users.set(socket.id, {token,name:decodedtoken.name,id:decodedtoken.id, roomid:null, online:true, pending:[]});
        userToken.set(decodedtoken.id,socket.id);
        next()
    } catch (error) {
        next(error);
    }

})

io.on('connection', async (socket) => {
    try {
        // start match
        socket.on("start", startMatch.bind(socket));

        // get all match available
        socket.on("getlist", listMatch.bind(socket));

         //  cancel match
         socket.on("cancel", cancelMatch.bind(socket));
        
        //  join match
        socket.on("join", joinMatch.bind(socket));
       
        // submit code
        socket.on("submit", submit.bind(socket));

        //  surrender match
        socket.on("surrender", surrender.bind(socket));

        //  disconnected 
        socket.on("disconnect",()=>{
            const user = users.get(socket.id);
            console.log(user)
            if(!user.roomid){
                users.delete(socket.id);
                userToken.delete(user.id);
            }else{
                user.online = false;
                users.set(socket.id,user);
            }
        })

    } catch (error) {
        console.log(error);
    }
});
/*

*/
