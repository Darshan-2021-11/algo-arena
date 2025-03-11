'use client'
import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface roomdata {
    id:string,
    initTime:Date,
    timer:number,
}

const Page = () => {
    // const [loading, setLoading] = useState(true);
    // const [disable, setdisable] = useState(false);
    // const [Problem, setProblem] = useState(null);
    // const [value, setValue] = useState("");
    // const [result, setResult] = useState(false);
    // const [winner, setwinner] = useState(null);
    // const [roomid, setroomid] = useState(null);
    // const [message, setmessage] = useState(null)
    // const onMount = (editor: any) => {
    //     editor.current = editor;
    //     editor.focus();
    // }

    const [connected, setconnection] = useState(false);
    const [roominfo, setroom] = useState();

    const socket = useRef<Socket | null>();

    const startMatch = ()=>{
        try {
            if(socket){
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        socket.current = io('http://localhost:9310')
        let soc = socket.current
        soc.on('error',(err)=>{
            console.log(err)
        })
        soc.on('disconnect',()=>{
            console.log('disconnected')
        })
        soc.on('connect', () => {
            console.log(soc)
            setconnection(true);
            // soc.emit('startMatch')
        })
        soc.on('matching', () => {
        })
        soc.on('matchstart', async (d) => {
            const url = `/Api/Problems/GetProblembyId?id=${d.problemid}`;
            const { data } = await axios.get(url);
            // setProblem(data.response.problem);
            // setroomid(d.roomid)
            // setLoading(false);
        })
        soc.on('status',(d)=>{
            // setmessage(d);
        })
        soc.on('matchEnd', (data) => {
            // if (data.winner) {
            //     if(data.winner.socket_id === soc.id){
            //         setwinner('you');
            //     }else{
            //         setwinner('opponent');
            //     }
            // }
            // setResult(true);
        })

        return () => {
            soc.off('connect')
        }
    }, [])

    return (
        // <div className='flex h-full w-full'>
        //     {message && 
        //     <div
        //     className='fixed left-5 p-4 bottom-12 bg-gray-500 text-white' 
        //     onClick={()=>{
        //         setmessage(null);
        //     }}
        //     >{message}
        //     </div>
        //         }
                
        //     {
        //         loading &&
        //         <div className='fixed top-0 left-0 w-screen h-screen z-10  flex flex-col justify-center items-center'>
        //             <AiOutlineLoading3Quarters className='text-orange-500 mb-16 h-32 w-32 animate-spin' />
        //             <div>finding match for you....</div>
        //             <button
        //                 disabled={disable}
        //                 className={`bg-blue-700 cursor-pointer ${disable && 'opacity-50'} ${disable && 'cursor-not-allowed'} rounded-2xl pl-2 pr-2 pt-1 pb-1 mt-3`}
        //             >cancel</button>
        //         </div>
        //     }
        //     {
        //         (!loading && !result) &&
        //         <>

        //             {
        //                 Problem ?
        //                     <div className="w-1/2 p-4 border-r flex flex-col ">
        //                         <div
        //                             className="flex align-middle justify-between"
        //                         >
        //                             <p
        //                                 className={` w-24 ${Problem.difficulty === 1 ? 'text-green-900' : 'text-orange-600'} `}
        //                             >{Problem.difficulty}</p>
        //                             <div
        //                                 className="text-gray-500"
        //                             >
        //                                 {
        //                                     Problem.topics.map((elem) => (
        //                                         <span
        //                                             key={uuidv4()}
        //                                             className="ml-4"
        //                                         >{elem}</span>
        //                                     ))
        //                                 }
        //                             </div>
        //                         </div>
        //                         <h2
        //                             className="text-xl font-bold m-5"
        //                         >{Problem.title}</h2>
        //                         <p>{Problem.question}</p>

        //                         <div
        //                             className="text-gray-400 border-gray-800 border-2 p-3 rounded-md mt-3"
        //                         >
        //                             {
        //                                 Problem.sample_testcases.map(({ question, answer }) => (
        //                                     <>
        //                                         <pre>input : {question}</pre>
        //                                         <p>output : {answer}</p>
        //                                     </>
        //                                 ))
        //                             }
        //                         </div>
        //                     </div>
        //                     :
        //                     //loading screen
        //                     <div className="w-1/2 p-4 border-r flex flex-col ">
        //                         <h2 className="text-xl font-bold"></h2>
        //                         <p></p>
        //                     </div>

        //             }
        //             <div className="w-1/2 p-4 flex flex-col">

        //                 <form className="flex-1 flex flex-col">
        //                     <div className="flex-1 mb-4">
        //                         <Editor
        //                             line={1}
        //                             height="70vh"
        //                             defaultLanguage="python"
        //                             theme="vs-dark"
        //                             defaultValue={`#write your code here`}
        //                             value={value}
        //                             onChange={
        //                                 (value, event) => setValue(value || "")
        //                             }
        //                             onMount={onMount}
        //                         />
        //                     </div>
        //                     <div className="flex justify-between pt-2">
        //                         <div className="flex items-center space-x-5"></div>
        //                         <div className="flex-shrink-0">
        //                             <button
        //                                 type="submit"
        //                                 className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        //                                 onClick={(e) => {
        //                                     e.preventDefault();
        //                                     if(socket.current){
        //                                         socket.current.emit('submit',{roomid,code:value})
        //                                     }
        //                                 }}
        //                             >
        //                                 Run
        //                             </button>
        //                         </div>
        //                     </div>
        //                 </form>

        //             </div>
        //         </>
        //     }

        //     {
        //         (result && !loading) && 
        //         <>
        //         {
        //             !winner ? 
        //             <div className='fixed h-screen w-screen left-0 top-0 flex items-center justify-center bg-gray-900 text-orange-600 text-6xl'>
        //             This was an draw
        //             </div>
        //             :
        //             winner === 'you'
        //             ?
        //             <div className='fixed h-screen w-screen left-0 top-0 bg-gray-900 flex items-center justify-center text-green-600 text-6xl'>
        //             you win
        //             </div>
        //             :
        //             <div className='fixed h-screen w-screen left-0 top-0 bg-gray-900 flex items-center justify-center text-red-600 text-6xl'>
        //             you lose
        //             </div>
        //         }
        //         <button 
        //         className='bg-blue-800 text-white p-2 rounded-2xl fixed left-2/4 bottom-14 -translate-x-2/4'
        //         onClick={()=>{
        //             if(!socket.current)return;
        //             setLoading(true);
        //             socket.current.on('matchstart', async (d) => {
        //                 soc.emit('startMatch')
        //             })
        //         }}
        //         >Another match</button>
        //         </>
        //     }

        // </div>
        <>
        {
            !connected ?
            <>
            <div>Loading</div>
            </>
            :
            <div>connected</div>
        }
        </>
    )
}

export default Page
