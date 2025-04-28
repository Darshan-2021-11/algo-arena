"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const Contest = () => {

    const currentpage = useRef(1);
    const [end, setend] = useState(false);
    const [contests, setcontests] = useState<{ _id: string, name: string, startTime: string, endTime: string }[]>([]);
    const [del, setdel] = useState<number | null>(null);
    const [loading, setloading] = useState(false);
    const [err, seterr] = useState<string|null>(null);

    const deleteProblem =async()=>{
        try {
            seterr(null);
            setloading(true);
            if(!del ) return;
            const url = `/Api/Contests/DeleteContest?id=${contests[del]._id}`;
            await axios.delete(url);
            setdel(null);
            const c  = [...contests];
            c.splice(del,1);
            setcontests(c);
            setdel(null);
        } catch (error:any) {
            console.log(error);
            seterr(error?.response?.data?.message||"something went wrong");
        }finally{
            setloading(false);
        }
    }

    const Getallcontests = async () => {
        try {
            if (end) {
                return;
            }

            const url = `/Api/Contests/GetAllContests?p=${currentpage.current}`;
            const { data } = await axios.get(url);

            if (data.success) {
                const c = data.Contest.map((e: { startTime: string, endTime: string }) => {
                    const s = new Date(e.startTime);
                    const ns = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()} ${s.getHours()}:${s.getMinutes()}`;
                    const en = new Date(e.startTime);
                    const ne = `${en.getFullYear()}-${en.getMonth()}-${en.getDate()} ${en.getHours()}:${en.getMinutes()}`;
                    e.startTime = ns;
                    e.endTime = ne;
                })
                setcontests(prev => [...prev, ...data.Contest]);
                if (data.end) {
                    setend(true);
                    currentpage.current++;
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        Getallcontests();

        document.addEventListener("scrollend", Getallcontests);
        return (() => {
            document.removeEventListener("scrollend", Getallcontests);
        })
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between  m-1 rounded-xl ">
                <p className="pl-1 text-xl">
                    {/* contests */}
                </p>

                <Link href={"/Admin/Contest/Create"} className="flex pl-3 pr-3 pt-2 pb-2 items-center justify-center bg-gray-700 w-fit rounded-xl m-1 shadow-sm shadow-gray-900 cursor-pointer">add<IoAddOutline className=" text-xl" /></Link>
            </div>
            <div className=" grid grid-cols-[1fr_1fr_1fr_40px] bg-gray-800 m-1 mt-3 mb-3 rounded-xl p-2 ">
                <p className="flex items-center justify-center">
                    name
                </p>
                <p className="flex items-center justify-center">
                    start
                </p>
                <p className="flex items-center justify-center">
                    end
                </p>
            </div>
            {
                contests.map((contest,i) => (
                    <div
                        key={contest._id}
                        className=" hover:bg-zinc-200 transition-all hover:text-zinc-900 grid grid-cols-[1fr_1fr_1fr_40px] bg-zinc-800 m-1 mb-2 rounded-xl shadow-md shadow-gray-600 pl-1 pr-1 pt-2 pb-2"
                    >
                        <Link
                            href={`/Admin/Contest/Update/${contest._id}`}
                            className="flex items-center justify-center"
                        >
                            {contest.name}
                        </Link>
                        <p className="flex items-center justify-center">{contest.startTime}</p>
                        <p className="flex items-center justify-center">{contest.endTime}</p>
                        <div
                            className="flex items-center justify-center cursor-pointer"
                            onClick={() => { setdel(i) }}
                        >
                            <MdDelete className="text-red-600" />
                        </div>
                    </div>
                ))
            }
            {
                del &&
                <div
                className="fixed left-0 top-0 w-screen h-screen bg-opacity-50 bg-black flex items-center justify-center"
              >
                <div
                  className="bg-zinc-800 rounded-2xl  h-fit p-4 w-fit flex flex-col items-center justify-center"
                >
                    <>
                    <div
                        className="flex"
                    >Do you want to
                        <p
                            className=" text-red-600 pl-1"
                        >
                            delete
                        </p>
                        <p
                            className="bg-gray-600 ml-1 mr-1 pl-1 pr-1 rounded-md mb-4"
                        >
                            {
                               contests[del].name
                            }
                        </p>
                        ?
                    </div>
                    {
                        err ?
                            <p
                                className="h-6 w-5"
                            ></p>
                            :
                            <p
                                className="h-6 w-5 text-red-600"
                            >{err}</p>
                    }
                    <div className="flex">
                        <button
                            className="m-1 p-1 h-10 w-16 flex items-center justify-center bg-red-700 hover:bg-red-900 rounded-md"
                            onClick={deleteProblem}
                        >
                            {
                                !loading ?
                                    <span>delete</span>
                                    :
                                    <AiOutlineLoading3Quarters className=" animate-spin" />
                            }

                        </button>
                        <button
                            className="m-1 p-1 h-10 w-16 bg-gray-700 hover:bg-gray-900 rounded-md"
                            onClick={() => {
                                setloading(false)
                                setdel(null);
                            }}
                        >cancel</button>
                    </div>
                    </>
                </div>
                </div>

            }
        </div>
    )
}

export default Contest;