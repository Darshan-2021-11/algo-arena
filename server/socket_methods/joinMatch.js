const { default: mongoose } = require("mongoose");
const { io } = require("..");
const { list, users, userToken } = require("../data_models");
const authorize = require("./authorize");
const endMatch = require("./endMatch");

async function joinMatch({roomid, id}) {
    try {

        const callauthorize = authorize.bind(this);
        if (!callauthorize) {
            return;
        }
        const user = users.get(id);
        if (user.roomid) {
            this.emit("server_report", { status: 3.2, message: "User is already in a room." });
            return;
        }

        if (!roomid) {
            this.emit("server_report", { status: 3.2, message: "Unable to join room." });
            return;
        }
        
       

        const Room = list.get(roomid);
         if (!Room) {
            this.emit("server_report", { status: 3.2, message: "This room does not exists." });
            return;
        }
        if (Room.prblem) {
            this.emit("server_report", { status: 3.2, message: "Room is already full." });
            return;
        }


        const usertoken = userToken.get(user.id);
        if (usertoken === Room.mems[0]) {
            this.emit("server_report", { status: 3.2, message: "Are you trying to play with your self ?" });
            return;
        }

        const problemschema = mongoose.connection.collection("problems");
        const problem = await problemschema.aggregate([
            { $sample: { size: 1 } },
            {
                $project: {
                    title: 1,
                    description: 1,
                    difficulty: 1,
                    tags: 1,
                    constraints: 1,
                    testcases: { $slice: ["$testcases", 3] },
                }
            }
        ]).toArray();

        if (!problem.length) {
            this.emit("server_report", { status: 3.2, message: "unable to create room." });
            return;
        }

        user.roomid = roomid;
        users.set(id, user);
        this.join(roomid);
        clearTimeout(Room.timeid);
        const tid = setTimeout(() => {
            endMatch(roomid,true);
            clearTimeout(tid);
        }, (30 * 60 * 1000));

        Room.mems.push({ name: user.name, id });
        Room.problem = problem[0];
        Room.timeid = tid;
        list.set(roomid, Room);
        this.to(roomid).emit("server_report", { status: 1, message: `${user.name} joined the room.` });
        this.to(roomid).emit("begin", {problem:Room.problem,id:null})
        this.emit("begin", {problem:Room.problem, id:roomid})

    } catch (error) {
        console.log(error);
        this.emit("server_report", { status: 3.2, message: "Unable to join room." });
    }
}

module.exports = joinMatch;