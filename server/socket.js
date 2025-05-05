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
        const t = socket.handshake.headers.cookie || "";
        const cookies = cookie.parse(t);
        const token = cookies["refresh-token"];
        if (!token) {
            throw new Error("Unauthorized access.")
        }

        const decodedtoken = jwt.verify(token, secret);
        const existingUser = users.get(decodedtoken.id);
        if (existingUser) {
            if (existingUser.online) {
                throw new Error("Unauthorized access.")
            }
            existingUser.online = true;
            const oldsocket = existingUser.socketid;
            existingUser.socketid = socket.id;
            users.set(decodedtoken.id, existingUser);
            users.delete(existingUser);
            userToken.delete(existingUser.socketid);

            if (existingUser.roomid) {
                const r = io.sockets.adapter.rooms.get(existingUser.roomid);
                if (r) {
                    r.add(socket.id);
                    r.delete(oldsocket);
                }
                const room = list.get(existingUser.roomid);
                if (!room.problem) {
                    socket.emit("created", { roomid: existingUser.roomid, message: "Logged in successfully." });
                } else {
                    socket.emit("begin", { problem: room.problem, id: existingUser.roomid })

                }
                socket.emit("login",)
            }

        } else {
            users.set(decodedtoken.id, { token, name: decodedtoken.name, roomid: null, online: true, pending: [], socketid: socket.id });
        }
        userToken.set(socket.id, decodedtoken.id);
        next()
    } catch (error) {
        console.log(error)
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
        socket.on("disconnect", () => {
            const userid = userToken.get(socket.id);
            const user = users.get(userid);
            if (!user.roomid) {
                users.delete(userid);
                userToken.delete(socket.id);
            } else {
                user.online = false;
                user.socket = null;
                users.set(userid, user);
            }
        })

    } catch (error) {
        console.log(error);
    }
});
/*

*/
