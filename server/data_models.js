const list = new Map();

const users = new Map();

const userToken = new Map();

module.exports = {
    list,
    users,
    userToken
}

/*
server_report : {status,message}
status: 
1 (good)
2 (announcement)
3 (err)
3.1 create room
3.2 join room
4 (leave)
5 (unauth)

created : {roomid,message}
*/