"use client"
import axios from "@/app/lib/errorhandler";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

const page = () => {
    const [sres, setsres] = useState<{ title: string, _id: string }[]>([]);
    const [problems, setproblems] = useState<{ title: string, _id: string, difficulty: string }[]>([]);
    const timeidref = useRef<NodeJS.Timeout | null>(null);
    const page = useRef(1);
    const end = useRef(false);
    const elem = useRef<HTMLDivElement | null>(null);
    const textref = useRef("");

    const search = async (text: string) => {
        try {
            timeidref.current && clearTimeout(timeidref.current)
            timeidref.current = null;
            const url = `/Api/Search?t=${text}`;
            const { data } = await axios.get(url);
            if (data.success) {
                if (Array.isArray(data.body.res)) {
                    setsres(data.body.res)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const text = e.currentTarget.value;
            if (!text || text.length > 240) {
                setsres([]);
                return;
            }
            if (timeidref.current) {
                clearTimeout(timeidref.current);
            }
            timeidref.current = setTimeout(() => {
                search(text);
            }, 100);

        } catch (error) {
            console.log(error);
        }
    }

    const Getproblems = async () => {
        try {
            const text = textref.current;
            if (end.current) {
                return;
            }
            if (!text || text.length > 240) {
                setsres([]);
                return;
            }
            timeidref.current && clearTimeout(timeidref.current)
            timeidref.current = null;
            const url = `/Api/Search/Getproblems?t=${text}&p=${page.current}`;
            const { data } = await axios.get(url);
            if (data.success) {
                console.log(data)
                if (data.body.end) {
                    end.current = true;
                }
                if (Array.isArray(data.body.res)) {
                    setproblems(prev=>[...prev,...data.body.res]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        const element = elem.current; 
        if(element){
            element.addEventListener("scrollend",Getproblems);

            return(()=>{
                element.removeEventListener("scrollend",Getproblems);
            })
        }
    },[])

    return (
        <div
            className="flex items-center justify-start w-full flex-col"
        >
            <div
                className="w-96 m-1 h-11 relative"
            >
                <input
                    onChange={handlChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            end.current = false;
                            page.current = 1;
                            end.current = false;
                            setproblems([]);
                            textref.current = e.currentTarget.value;
                            Getproblems()
                        }
                    }}
                    placeholder="type something"
                    className="p-1 text-white outline-none bg-zinc-700 rounded-xl w-full h-full "
                    type="text"
                    name=""
                    id=""
                />
                {
                    sres.length > 0 &&
                    <div
                        className="absolute top-12 left-0 w-full bg-zinc-800 p-2 rounded-xl flex flex-col"
                    >
                        {
                            sres.map((s) => (
                                <Link href={`/Problems/${s._id}`} className="text-white cursor-pointer hover:bg-gray-500 hover:text-black p-1 mb-1 border-b-2 border-gray-500" key={v4()}>{s.title}</Link>
                            ))
                        }
                    </div>
                }


            </div>
            <div
                className="w-full rounded-2xl overflow-hidden"
                style={{
                    height: "calc( 100vh - 120px )"
                }}
            >
                <div
                    className="overflow-scroll"
                    ref={elem}
                >
                    {
                        problems.map((x, i) => (
                            <div
                                key={v4()}
                                className={`text-white  ${i % 2 ? 'bg-gray-600' : ''} p-2 flex`}
                            >
                                <p className='pr-1 pl-1 w-24'>{i + 1}</p>
                                <Link
                                    href={`/Problems/${x._id}`}
                                    className='  w-9/12 hover:text-blue-800 hover:cursor-pointer overflow-hidden'
                                >
                                    {x.title}
                                </Link>
                                <p
                                    className={` w-24 font-medium ${x.difficulty === "Easy" ? 'text-green-900' : x.difficulty === "Medium" ? 'text-orange-600' : "text-red-600"} `}
                                >{x.difficulty}</p>
                            </div>
                        ))
                    }
                </div>

            </div>
            <div>

            </div>

        </div>
    )
}

export default page;