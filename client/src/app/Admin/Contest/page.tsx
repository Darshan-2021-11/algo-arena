"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoAddOutline } from "react-icons/io5";

const Contest = () => {

    const currentpage = useRef(1);
    const [end, setend] = useState(false);
    const [contests, setcontests] = useState<{_id:string, name:string, startTime:string, endTime:string}[]>([]);

    const Getallcontests = async() => {
        try {
            if(end){
                return;
            }

            const url = `/Api/Contests/GetAllContests?p=${currentpage.current}`;
            const {data} = await axios.get(url);

            if(data.success){
                const c = data.Contest.map((e:{startTime:string, endTime:string})=>{
                    const s = new Date(e.startTime);
                    const ns = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()} ${s.getHours()}:${s.getMinutes()}`;
                    const en = new Date(e.startTime);
                    const ne = `${en.getFullYear()}-${en.getMonth()}-${en.getDate()} ${en.getHours()}:${en.getMinutes()}`;
                    e.startTime = ns;
                    e.endTime = ne;
                })
                setcontests(prev=>[...prev,...data.Contest]);
                if(data.end){
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

        document.addEventListener("scrollend",Getallcontests);
        return(()=>{
            document.removeEventListener("scrollend",Getallcontests);
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
            <div className=" grid grid-cols-3 bg-gray-800 m-1 mt-3 mb-3 rounded-xl p-2 ">
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
                    contests.map((contest)=>(
                        <Link 
                        href={`/Admin/Contest/Update/${contest._id}`}
                        key={contest._id}
                        className=" hover:bg-zinc-200 transition-all hover:text-zinc-900 grid grid-cols-3 bg-zinc-800 m-1 mb-2 rounded-xl shadow-md shadow-gray-600 pl-1 pr-1 pt-2 pb-2"
                        >
                            <div 
                            className="flex items-center justify-center"
                            >
                                {contest.name}
                            </div>
                            <p className="flex items-center justify-center">{contest.startTime}</p>
                            <p className="flex items-center justify-center">{contest.endTime}</p>
                        </Link>
                    ))
                }

        </div>
    )
}

export default Contest;