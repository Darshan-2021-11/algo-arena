const axios = require('axios');

const { users, list } = require('../data_models');
const endMatch = require('./endMatch');
const authorize = require('./authorize');
const completeMatch = require('../utils/completeMatch');


const getResult = async (tokens, headers, problemId) => {

    const newtokens = [];
    for (let i = 0; i < tokens.length; i++) {
        try {
            const submissionurl = `http://localhost:2358/submissions/${tokens[i]}?base64_encoded=false&wait=false`;
            const data = await axios.get(submissionurl, headers);
            console.log(data)
            if (data.status === 200 && data.data.status.id !== 1 && data.data.status.id !== 2) {
                    const storeResultUrl = `http://localhost:3000/Api/Problems/StoreResult?pid=${problemId}&msg=${data.data.status.description}`
                    await axios.get(storeResultUrl, headers);

                if ( data.data.status.id !== 3 ) {
                    return { passed: false, newtokens };
                }else{
                    return {passed:true, newtokens}
                }

            } else {
                newtokens.push(tokens[i])
            }
        } catch (error) {
            console.log(error);
        }
    }
    return { passed: true, newtokens };

}

async function submit({ code, roomid, lang, id }) {
    const callauthorize = authorize.bind(this);
    if (!callauthorize(id)) {
        return;
    }
    try {
        if (!code) {
            this.emit("server_report", { status: 3.2, message: "Invalid request." });
            return;
        }
        if (code.length === 0) {
            this.emit("server_report", { status: 3, message: "write some code to run it." });
            return;
        }

        const user = users.get(id);
        this.to(roomid).emit("server_report", { status: 1, message: `${user.name} submitted code.` })
        this.emit("server_report", { status: 1, message: `Submitted code.` })
        const url = "http://localhost:3000/Api/Submissions/Run";
        const contest_secret = process.env.contest_secret;
        const headers = {
            headers: {
                Cookie: `contest_secret=${contest_secret}`,
            },
        }

        const room = list.get(roomid);

        try {
            const { data } = await axios.post(
                url,
                { id: room.problem._id, code, lang, user: id },
                headers
            )

            if (data.success) {
                let tokens = data.tokens;
                const tid = setInterval(async () => {
                    const res = await getResult(tokens, headers, room.problem._id);
                    console.log(res)
                    if (res.newtokens.length === 0 && !res.passed) {
                        clearInterval(tid);
                        this.to(roomid).emit("server_report", { status: 3, message: `${user.name}'s code is wrong.` })
                        this.emit("server_report", { status: 3, message: `Your code is wrong.` });
                    }
                    tokens = res.newtokens;
                    if (res.passed) {
                        clearInterval(tid);
                        this.emit("win");
                        this.leave(roomid);
                        this.to(roomid).emit("lose");
                        room.duelid && await completeMatch(
                            id,
                            "win",
                            room.mems[1].id === id ? room.mems[0].id : room.mems[1].id,
                            room.duelid,
                            code,
                            lang,
                            user.token
                        )
                        endMatch(roomid);
                    }

                }, 1000);
            } else {
                this.to(roomid).emit("server_report", { status: 3, message: `${user.name}'s code is wrong.` });
                this.emit("server_report", { status: 3, message: `Your code is wrong.` });
            }
        } catch (error) {
            console.log(error);
            this.to(roomid).emit("server_report", { status: 3, message: `${user.name}'s code is wrong.` });
            this.emit("server_report", { status: 3, message: `Your code is wrong.` });
        }



    } catch (error) {
        console.log(error)
        this.emit("server_report", { status: 3, message: `Unable to run code.` });
    }
}

module.exports = submit;
