'use client'
import React from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from '../lib/contexts/socketContext';
import CodeEditor from '../Problems/[id]/Editor';
import { useEditor } from '../lib/contexts/editorContext';

const Page = () => {
    const { reset, cancelMatch, surrenderMatch, startMatch, matchStart, setLoading, setmessage, loading, disable, Problem, result, winner, roomid, message, socket } = useSocket();
    const { value } = useEditor();

    return (
        <div className='flex h-full w-full'>
            {message &&
                <div
                    className='fixed left-5 p-4 bottom-12 bg-gray-500 text-white'
                    onClick={() => {
                        setmessage(null);
                    }}
                >{message}
                </div>
            }

            {
                !matchStart && (
                    loading ?
                        <div className='fixed top-0 left-0 w-screen h-screen z-10  flex flex-col justify-center items-center'>
                            <AiOutlineLoading3Quarters className='text-orange-500 mb-16 h-32 w-32 animate-spin' />
                            <div>finding match for you....</div>
                            <button
                                onClick={() => cancelMatch()}
                                disabled={disable}
                                className={`bg-blue-700 cursor-pointer ${disable && 'opacity-50'} ${disable && 'cursor-not-allowed'} rounded-2xl pl-2 pr-2 pt-1 pb-1 mt-3`}
                            >cancel</button>
                        </div>
                        :
                        <div className='fixed top-0 left-0 w-screen h-screen z-10  flex flex-col justify-center items-center'>
                            <div>Find opponent</div>
                            <button
                                disabled={disable}
                                onClick={() => {
                                    startMatch();
                                    setLoading(true)
                                }}
                                className={`bg-blue-700 cursor-pointer ${disable && 'opacity-50'} ${disable && 'cursor-not-allowed'} rounded-2xl pl-2 pr-2 pt-1 pb-1 mt-3`}
                            >start</button>
                        </div>
                )
            }

            {
                (!loading && matchStart && !result) &&
                <>

                    {
                        Problem ?
                            <div className="w-1/2 p-4 border-r flex flex-col ">
                                <div
                                    className="flex align-middle justify-between"
                                >
                                    <p
                                        className={` w-24 ${Problem.difficulty === 1 ? 'text-green-900' : 'text-orange-600'} `}
                                    >{Problem.difficulty}</p>
                                    <div
                                        className="text-gray-500"
                                    >
                                        {
                                            Problem.topics.map((elem) => (
                                                <span
                                                    key={uuidv4()}
                                                    className="ml-4"
                                                >{elem}</span>
                                            ))
                                        }
                                    </div>
                                </div>
                                <h2
                                    className="text-xl font-bold m-5"
                                >{Problem.title}</h2>
                                <p>{Problem.question}</p>

                                <div
                                    className="text-gray-400 border-gray-800 border-2 p-3 rounded-md mt-3"
                                >
                                    {
                                        Problem.sample_testcases.map(({ question, answer }) => (
                                            <>
                                                <pre>input : {question}</pre>
                                                <p>output : {answer}</p>
                                            </>
                                        ))
                                    }
                                </div>
                                {
                                    matchStart &&
                                    <button
                                        disabled={disable}
                                        onClick={() => {
                                            surrenderMatch();
                                        }}
                                        className={`bg-red-700 w-28 cursor-pointer ${disable && 'opacity-50'} ${disable && 'cursor-not-allowed'} rounded-xl pl-2 pr-2 pt-1 pb-1 mt-3`}
                                    >surrender</button>
                                }
                            </div>

                            :
                            //loading screen
                            <div className="w-1/2 p-4 border-r flex flex-col ">
                                <h2 className="text-xl font-bold"></h2>
                                <p></p>
                            </div>

                    }
                    <div className="w-1/2 p-4 flex flex-col">

                        <form className="flex-1 flex flex-col">
                            <CodeEditor />
                            <div className="flex justify-between pt-2">
                                <div className="flex items-center space-x-5"></div>
                                <div className="flex-shrink-0">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (socket) {
                                                socket.emit('submit', { roomid, code: value })
                                            }
                                        }}
                                    >
                                        Run
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </>
            }

            {
                (result && !loading) &&
                <>
                    {
                        !winner ?
                            <div className='fixed h-screen w-screen left-0 top-0 flex items-center justify-center bg-gray-900 text-orange-600 text-6xl'>
                                This was an draw
                            </div>
                            :
                            winner === 'you'
                                ?
                                <div className='fixed h-screen w-screen left-0 top-0 bg-gray-900 flex items-center justify-center text-green-600 text-6xl'>
                                    you win
                                </div>
                                :
                                <div className='fixed h-screen w-screen left-0 top-0 bg-gray-900 flex items-center justify-center text-red-600 text-6xl'>
                                    you lose
                                </div>
                    }
                    <button
                        className='bg-blue-800 text-white p-2 rounded-2xl fixed left-2/4 bottom-14 -translate-x-2/4'
                        onClick={() => {
                            reset();
                        }}
                    >go back</button>
                </>
            }

        </div>
    )
}

export default Page