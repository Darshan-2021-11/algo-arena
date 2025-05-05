import { useAuth } from "@/app/lib/slices/authSlice";
import axios from "@/app/lib/errorhandler";
import React, { Dispatch, KeyboardEventHandler, SetStateAction, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

interface msgtype {
    message: string,
    _id: string,
    replies?: msgtype[],
    user: string
}

interface commentpayload {
    comments: msgtype[],
    setcomments: Dispatch<SetStateAction<msgtype[]>>,
    id: string | string[]
}

const Commentpage: React.FC<commentpayload> = ({ comments, setcomments, id }) => {

    const auth = useSelector(useAuth)
    const comment = useRef("");
    const getComments = async () => {
        try {
            const url = `/Api/Comment/List/ByProblemId?pid=${id}&id=${auth.id}`
            const { data } = await axios.get(url);
            if (data.success) {
                setcomments([...comments, ...data.comments])
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        comments.length === 0 && getComments();
    }, []);

    const getReplies = async () => {

    }

    const postComment = async () => {
        try {
            const msg = comment.current.trim();
            if (msg.length === 0) {
                return;
            }
            const url = `/Api/Comment/Add`
            const body = {
                pid: id,
                msg
            }
            const { data } = await axios.post(url, { ...body });
            if (data.success) {
                setcomments([...comments, { message: msg, _id: data.id, user: "you" }])
                comment.current = ""
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className=" relative h-full flex flex-col overflow-hidden bg-zinc-800 m-2 "

            >
                <div
                    className="p-3 overflow-scroll flex-1 pb-28"
                    style={{
                        height: "calc(85vh - 100px)"
                    }}
                >
                    {
                        comments.map((c) => (
                            <div
                                className="mb-3 rounded-xl p-2 font-sans"
                                key={v4()}
                            >
                                <p
                                className=" text-xs text-gray-400 text-nowrap "
                                >{c.user === auth.username ? "you" : c.user}</p>
                                <p
                                className="pl-2 font-bold"
                                >{c.message}</p>
                                <hr 
                                className="mt-2 border-none w-full h-0.5 bg-zinc-700"
                                />
                            </div>
                        ))
                    }
                    {
                        comments.length === 0 && <p>Currently no comments available.</p>
                    }
                </div>


                <input
                    onChange={(e) => {
                        comment.current = e.target.value;
                    }}
                    onKeyUp={(e) => {
                        if (e.code === "Enter") {
                            postComment();
                            e.currentTarget.value = ""
                        }
                    }}

                    type="text"
                    placeholder="write something here and press enter."
                    className="pl-3 w-full pt-2 pb-2 outline-none rounded-xl absolute bg-zinc-700 left-0 "
                    style={{
                        top:"70vh"
                    }}
                />
            </div>
        </>
    )
}

export default Commentpage;