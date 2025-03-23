'use server'

import { starttest } from "@/app/Problems/[id]/problemslice";
import store from "@/app/lib/store";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {  NextResponse } from "next/server";

const maxtime = 4000000;

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const reader = req.body?.getReader();
        const decoder = new TextDecoder();
        let body = '';

        while (true) {
            const { done, value } = await reader?.read()!;
            if (done) break;
            body += decoder.decode(value, { stream: true });
        }

        const { id, code, lang } = JSON.parse(body);
        const url = `http://localhost:3000/Api/Problems/GetTestcases?id=${id}`;
        const { data } = await axios.get(url);

        const { test_cases } = data;
        if (!test_cases) {
            return NextResponse.json({success:false,message:"No test cases found"},{status:400})
        }

        // store.dispatch(starttest(10))

        const datas: any[] = [];
        const proms = test_cases.map((test_case) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const judgeurl = 'http://localhost:2358/submissions/';

                    const submissionBody = {
                        source_code: code,
                        language_id: 71,
                        stdin: test_case.question,
                        expected_output: test_case.answer,
                        cpu_time_limit: '1',
                        wall_time_limit: '1',
                        
                    };

                    switch(lang){
                        case "javascript":
                            submissionBody.language_id = 63;
                            break;
                        case "python":
                            submissionBody.language_id = 71;
                            break;
                        case "go":
                            submissionBody.language_id=60;
                            break;
                        case "cpp":
                            submissionBody.language_id = 54;
                            break;
                        case "c":
                            submissionBody.language_id = 48;
                            break;
                        case "java":
                            submissionBody.language_id = 62;
                            break;
                    }
                    const { data } = await axios.post<{ token: string }>(judgeurl, submissionBody);
                    const { token } = data;
                    let currtime = 0;

                    const id = setInterval(async () => {
                        try {
                            if(currtime >= maxtime){
                                throw new Error("server Timeout")                                
                            }
                            currtime +=1000;
                            const submissionurl = `http://localhost:2358/submissions/${token}?base64_encoded=true&wait=false`;
                            const { data } = await axios.get(submissionurl);
                            if(data.status.description !== "Processing" && data.status.description !== "In Queue" ){
                                clearInterval(id);
                                let resdata : any = data ;
                                if(data.status.description != "Accepted"){
                                    const jsondata = atob(data.compile_output);
                                    // const jsondata  = new TextDecoder().decode(arraybuffer);
                                    console.log("decodeddata",data,jsondata)
                                    throw new Error(data.status.description)
                                }

                                if(data.stdout){
                                    const arraybuffer = Uint8Array.from(atob(data.stdout),c=>c.charCodeAt(0));
                                    const jsondata  = new TextDecoder().decode(arraybuffer);
                                    console.log("decodeddata",jsondata)
                                    // throw new Error(data.status.description)
                                }
                          
                            // console.log(data,resdata)
                            
                            if (resdata.error) {
                                clearInterval(id);
                                reject(resdata.error);
                            } else if (resdata.time) {
                                if(resdata.status !== 2){
                                    clearInterval(id);
                                    resolve(resdata);
                                    datas.push(resdata);
                                }
                                
                            }
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
        return NextResponse.json({ success: true, data: datas });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ success: false, err:err?.message }, { status: 500 });
    }
}
