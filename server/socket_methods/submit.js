const axios = require('axios');

const { io } = require('..');
const { users } = require('../data_models');


const getResult = async (tokens,headers) => {
    const callauthorize = authorize.bind(this);
       if(!callauthorize){
        return;
       }
    const newtokens = [];
    for (let i = 0; i < tokens.length; i++) {
        try {
            const submissionurl = `http://localhost:2358/submissions/${tokens[i]}?base64_encoded=false&wait=false`;
            const data = await axios.get(submissionurl,headers);
            if (data.status === 200 && problemId.current) {
                const storeResultUrl = `/Api/Problems/StoreResult?pid=${problemId.current}&msg=${data.data.status.description}`
                const d = await axios.get(storeResultUrl);
                if(d.data.success){
                    if(d.data.status.id !== 3){
                        return {res:false,newtokens};
                    }
                }

            }
            return {res:true,newtokens};
        } catch (error) {
            console.log(error);
        }
    }
    return true;
}

async function submit(code, roomid, lang) {
    try {
        if (!code) {
        this.emit("server_report",{status:3,message:"Invalid request."});
            return;
        }
        if (code.length == 0) {
        this.emit("server_report",{status:3,message:"write some code to run it."});
            return;
        }
        const room = io.sockets.adapter.rooms.get(roomid);
        room.emit("msg",`<username> submited code.`)
        const usertoken = users.get(this.id);
        const url = "http://localhost:3000/Api/Submissions/Run";
        const headers = {
            headers: {
                Cookie: `token=${usertoken}`,
            },
        }

        const { data } = await axios.post(
            url,
            { id: room.problem, code, lang },
            headers
        )

        if (data.success) {
            const tokens = data.tokens;
            const id = setInterval(async() => {
            const res = await getResult(tokens,headers);
            if (res.tokens.length === 0 || !res.passed) {
                clearInterval(id);
                if(res.passed){
                    this.emit("win");
                    // handle lose
                }
            }
            }, 1000);
        }else{
            this.emit("err", "unable to run code");
        }


    } catch (error) {
        console.log(error)
        this.emit("err", "unable to run code");
    }
}

module.exports = submit;
