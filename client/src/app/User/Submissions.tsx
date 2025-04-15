import axios from "axios";
import { useSelector } from "react-redux";
import { useAuth } from "../lib/slices/authSlice";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

export interface submissionType {
    createdAt: string,
    language: string,
    problem: string,
    name: string,
    result: string,
    code: string
}

interface proptype {
    setcode : React.Dispatch<React.SetStateAction<string|null>>
}

const Submissions : React.FC<proptype> = ({setcode}) => {
    const [submissions, setsubmissions] = useState<submissionType[]>([]);
    const currentTime = Date.now();
    const { id } = useSelector(useAuth);
    const page = useRef(1);
    const [end, setend] = useState(false);
    const limit = 15;
    // const [code, setcode] = useState<string | null>(null);

    const getSubmissions = async () => {
        try {
            const url = `/Api/Problems/GetAllSubmissions?u=${id}&p=${page.current}&l=${limit}`;
            const { data } = await axios.get(url);
            if (data.success) {

                setsubmissions((prev) => [...prev, ...data.submissions]);
                if (data.submissions.length < limit) {
                    setend(true);
                }
            }
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }

    const nextPage = async () => {
        try {
            if (end) {
                return;
            }
            page.current += 1;
            getSubmissions();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSubmissions()
    }, [])


    useEffect(() => {
        const onScrollend = (e: Event) => {
            nextPage();
        }
        document.addEventListener("scrollend", onScrollend)

        return (() => {
            document.removeEventListener("scrollend", onScrollend);
        })
    }, [])

    return (
        <div
            className="relative w-full h-fit shadow-md shadow-zinc-900  bg-zinc-900 mb-1"

        >
            <div
                className="grid grid-cols-8 flex-1 p-1 bg-gray-900"
            >
                <p
                    className="flex items-center "
                >sl. no</p>
                <p
                    className=" col-span-3 flex items-center "
                >problem</p>
                <p
                    className=" col-span-3 flex items-center "
                >result</p>
                <p
                    className="flex items-center "
                >lang</p>
            </div>
            {
                submissions.map((s, i) => (
                    <div
                        key={v4()}
                        onClick={() => {
                            setcode(s.code);
                        }}
                        className={` ${s.result === "Accepted" ? "bg-green-900" : "bg-red-900"} cursor-pointer grid grid-cols-8 p-1 mt-1 mb-1.5 rounded-lg`}
                    >
                        <p
                            className="flex items-center "
                        >{i + 1}</p>
                        <p
                            className=" col-span-3 flex items-center "
                        >{s.name}</p>
                        <p
                            className={` col-span-3 flex items-center `}
                        >{currentTime - new Date(s.createdAt).getTime() > 180000 ? s.result === "Pending" ? "Failed to run" : s.result : s.result}</p>
                        <p
                            className="flex items-center "
                        >{s.language}</p>
                    </div>
                ))
            }

           
        </div>
    )
}
export default Submissions