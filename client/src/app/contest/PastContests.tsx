import axios from "@/app/lib/errorhandler";
import { useEffect, useRef, useState } from "react";
import { contestmodel } from "../lib/api/contestModel";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';

interface contestmodel_id extends contestmodel {
    _id: string
};


const PastContests = () => {
    const [contests, setContests] = useState<Array<contestmodel_id>>([]);
    const [loading, setLoading] = useState(true);
    const elemref = useRef<HTMLDivElement>(null);
    const movement = 20;
    const page = useRef(1);
    const end = useRef(false);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                if(end.current){
                    return;
                }
                const url = `Api/Contests/GetContests?t=past`;
                const response = await axios.get(url);

                if (response.data?.success) {
                    setContests(response.data.Contest);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch contests:", response.data?.message);
                }
            } catch (error: any) {
                console.error(
                    "Error fetching contests:",
                    error.response?.data || error.message
                );
            }
        };

        fetchContests();
    }, []);

    useEffect(() => {
        function handlescroll(e: WheelEvent) {
            e.preventDefault()
            const elem = elemref.current;
            if (elem) {
                let elemx = elem.scrollLeft;
                if (e.deltaY < 0 || e.deltaX < 0) {
                    elemx -= movement;
                } else {
                    elemx += movement;
                }
                elem.scrollLeft = elemx;
            }
        }

        const elem = elemref.current;
        if (!elem) {
            return;
        }
        elem.addEventListener("wheel", handlescroll);
        return (() => {
            elem.removeEventListener("wheel", handlescroll);
        })

    }, [])


    return (
        <>
            <h1 className="text-2xl font-bold mb-4 ">Past contests</h1>
            <div className=" overflow-scroll" ref={elemref}>
            {loading ? (
                <p>Loading contests...</p>
            ) : (
                <ul className="flex flex-col transition-all" >
                    {contests.length === 0 && <div>No past contests.</div> }
                    {contests.map((contest) => (
                        <Link key={uuidv4()} href={`/contest/${contest._id}`} >
                            <li key={uuidv4()} className="bg-gray-500 bg-opacity-35 w-full hover:bg-opacity-55 hover:m-2 transition-all p-4 rounded shadow-md m-1">
                                <h2 className="text-xl font-semibold mb-3">{contest.name.length > 9 ? contest.name.substring(0,9)+"..." : contest.name}</h2>
                                <p className=" text-sm text-gray-400">{new Date(contest.startTime).toLocaleDateString("en-US", {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                })}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
            </div>

        </>
    )
}

export default PastContests