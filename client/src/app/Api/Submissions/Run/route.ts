'use server'

import { starttest } from "@/app/Problems/[id]/problemslice";
import store from "@/app/store";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {  NextResponse } from "next/server";

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

        const { id, code } = JSON.parse(body);
        const url = `http://localhost:3000/Api/Problems/GetTestcases?id=${id}`;
        const { data } = await axios.get(url);

        const { test_cases } = data;
        if (!test_cases) {
            return res.status(400).json({ success: false, message: 'No test cases found' });
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
                        cpu_time_limit: '2',
                        wall_time_limit: '5',
                    };
                    // console.log(code)

                    const { data } = await axios.post<{ token: string }>(judgeurl, submissionBody);
                    const { token } = data;

                    const id = setInterval(async () => {
                        try {
                            const submissionurl = `http://localhost:2358/submissions/${token}`;
                            const { data } = await axios.get(submissionurl);

                            // console.log(data)
                            if (data.error) {
                                clearInterval(id);
                                reject(data.error);
                            } else if (data.time) {
                                if(data.status !== 2){
                                    clearInterval(id);
                                    resolve(data);
                                    datas.push(data);
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
        return NextResponse.json({ success: false, err }, { status: 500 });
    }
}
