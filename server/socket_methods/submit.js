const axios = require('axios');

const { ongoing_matches_list } = require("../data_models");
const { io } = require('..');
const endMatch = require('./endMatch');
const { PROBLEMS } = require('../problems');

async function submit(socket,d){
    try {
        
   
    const { roomid, code } = d;
    // console.log(code)
    const room = ongoing_matches_list.get(roomid);
    if(room.winner){
        return;
    }

    const id = ongoing_matches_list.get(roomid).question;

        const { sample_testcases } = PROBLEMS[id];
        if (!sample_testcases) {
            // return res.status(400).json({ success: false, message: 'No test cases found' });
        }



        // store.dispatch(starttest(10))
        let passed = true;
        const proms = sample_testcases.map((test_case) => {
            return new Promise(async (resolve, reject) => {
                try {
                    // console.log(test_case)
                    const judgeurl = 'http://localhost:2358/submissions/';
                    console.log(judgeurl)
                    const submissionBody = {
                        source_code: code,
                        language_id: 71,
                        stdin: test_case.question,
                        expected_output: test_case.answer,
                        cpu_time_limit: '2',
                        wall_time_limit: '5',
                    };

                    const { data } = await axios.post(judgeurl, submissionBody);
                    const { token } = data;

                    const id = setInterval(async () => {
                        try {
                            const submissionurl = `http://localhost:2358/submissions/${token}`;
                            const { data } = await axios.get(submissionurl);

                            if (data.error) {
                                clearInterval(id);
                                reject(data.error);
                            } else if (data.time) {
                                // console.log(data)
                                clearInterval(id);
                                resolve(data);
                                if(data.status.description !== "Accepted") passed = false;
                            }
                        } catch (error) {
                            clearInterval(id);
                            reject(error);
                        }
                    }, 1000);
                } catch (error) {
                    reject(error);
                }
            });
        });

        await Promise.all(proms);
        if(passed){
            console.log(room,socket)
            if(room.users[0].socket_id === socket.id){
                room.winner = room.users[0];
            }else{
                room.winner = room.users[1];
            }
            endMatch(roomid);
            io.to(roomid).emit('winner',room.winner)
        }else{
            socket.emit('status','wrong answer')
        }
        
        console.log(datas)
        // return NextResponse.json({ success: true, data: datas });
    } catch (error) {
        console.log(error)
    }
}

module.exports = submit;
