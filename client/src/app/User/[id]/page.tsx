'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import Activity from '../Activity';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/app/lib/slices/authSlice';
import Submissions from '../Submissions';
import { RxCross2 } from "react-icons/rx";
import Dp from '@/app/utils/Auth/dp';
import axios from '@/app/lib/errorhandler';
import { setError } from '@/app/lib/slices/popupSlice';
import Duels from './Duels';


const Page: React.FC = () => {
    const router = useRouter();
    const user = useSelector(useAuth);
    const [code, setcode] = useState<string | null>(null);
    const [userdata, setud] = useState<{ username: string, photo: { data: string, type: string } | null, questions: { duels: number, wins: number, draws: number, losses: number } | undefined, duels: { submission: number, hardQuestion: number, mediumQuestion: number, easyQuestion: number } | null } | null>(null);

    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
            (async () => {
                try {
                    const url = `/Api/User/Auth/UserData?id=${id}`;
                    const { data } = await axios.get(url);
                    if (data.success) {
                        console.log(data);
                        setud(data.body);
                    }
                } catch (error: any) {
                    if (error.response.data.message) {
                        dispatch(setError(error.response.data.message));
                    } else if (error.message) {
                        dispatch(setError(error.message));
                    } else {
                        dispatch(setError("unable to login."));
                    }
                    console.log(error);

                }
            })()

    }, [id])


    return (
        <>
            {/* {
                id === user.id &&
                <div
                    className='flex max-w-screen overflow-hidden'
                >
                    <div
                        className='bg-zinc-900 rounded-xl m-3 flex-1 max-w-96'
                    >
                        <div className="pt-16 flex flex-col items-center gap-3 no-scrollbar ">
                            <Dp size='big' />
                            <h2 className="text-md">{user.username}</h2>
                        </div>
                        <div
                            className='flex items-center justify-center'
                        >
                            <button
                                className='bg-gray-800 pt-1 pb-1 pl-2 text-md pr-2 rounded-xl m-1 cursor-pointer'
                                onClick={() => {
                                    router.push("/LeaderBoard")
                                }}>LeaderBoard</button>
                        </div>
                    </div>
                    <div
                        className='overflow-scroll'
                    >
                        {id && <Activity id={id} />}
                        <Submissions setcode={setcode} />
                    </div>
                    <div>
                        <Duels duels={userdata?.duels}/>
                    </div>
                    {
                        code &&
                        <div
                            className=" fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center"
                        >
                            <div
                                className="  relative w-3/4 h-3/4 overflow-hidden rounded-xl bg-zinc-900 flex"
                            >
                                <pre
                                    className='bg-zinc-600 rounded-xl w-full p-3 m-3 overflow-scroll'
                                >
                                    {code}
                                </pre>
                                <button
                                    className="absolute right-0 top-0 m-2 scale-150 text-red-700"
                                    onClick={() => {
                                        setcode(null);
                                    }}
                                ><RxCross2 /></button>
                            </div>

                        </div>
                    }
                </div>
            } */}

            {
                userdata &&
                <div
                    className='flex max-w-screen overflow-hidden'
                >
                    <div
                        className='bg-zinc-900 rounded-xl m-3 flex-1 max-w-96'
                    >
                        <div className="pt-16 flex flex-col items-center gap-3 no-scrollbar ">
                            <Dp size='big' photo={userdata.photo} />
                            <h2 className="text-md">{userdata.username}</h2>
                        </div>
                        <div
                            className='flex items-center justify-center'
                        >
                            <button
                                className='bg-gray-800 pt-1 pb-1 pl-2 text-md pr-2 rounded-xl m-1 cursor-pointer'
                                onClick={() => {
                                    router.push("/LeaderBoard")
                                }}>LeaderBoard</button>
                        </div>
                    </div>
                    <div
                        className='overflow-scroll'
                    >
                        {typeof (id) === "string" && <Activity id={id} />}
                        {typeof (id) === "string" && <Submissions setcode={setcode} uid={id} />}
                    </div>
                    {/* <Duels duels={userdata.duels}/> */}
                    {
                        code &&
                        <div
                            className=" fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center"
                        >
                            <div
                                className="  relative w-3/4 h-3/4 overflow-hidden rounded-xl bg-zinc-900 flex"
                            >
                                <pre
                                    className='bg-zinc-600 rounded-xl w-full p-3 m-3 overflow-scroll'
                                >
                                    {code}
                                </pre>
                                <button
                                    className="absolute right-0 top-0 m-2 scale-150 text-red-700"
                                    onClick={() => {
                                        setcode(null);
                                    }}
                                ><RxCross2 /></button>
                            </div>

                        </div>
                    }
                </div>
            }

        </>
    );
}

export default Page;
