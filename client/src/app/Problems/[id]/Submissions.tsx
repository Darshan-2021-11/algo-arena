import { useAuth } from "@/app/lib/slices/authSlice"
import { submissionType } from "@/app/User/Submissions"
import axios from "axios"
import { Dispatch, useEffect, useRef, useState } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"
import { useSelector } from "react-redux"
import { v4 } from "uuid"

interface propType {
    id: string | string[]
}

const Submissions: React.FC<propType> = ({ id }) => {
    const [code, setcode] = useState<string | null>();
    const currentTime = Date.now();
    const page = useRef(1);
    const [end, setend] = useState(false);
    const limit = 10;
    const [submissions, setsubmissions] = useState<submissionType[]>([]);
    const auth = useSelector(useAuth);

    const getSubmissions = async () => {
        try {
            const url = `/Api/Problems/GetSubmissionbyId?pb=${id}&p=${page}&id=${auth.id}`;
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

    return (
        <div
            className="relative w-full flex-1 shadow-md shadow-zinc-900  bg-zinc-900 mb-1 overflow-scroll "
            style={{
                height:"calc(85vh - 56px)"
            }}
        >
            <div
                className="grid grid-cols-8 flex-1 p-1 bg-gray-900"
            >
                <p
                    className="flex items-center "
                >sl. no</p>
               
                <p
                    className=" col-span-4 flex items-center "
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
                        className={` ${s.result === "Accepted" ? "bg-green-900" : "bg-red-900"} cursor-pointer grid grid-cols-8 p-1 m-1 rounded-lg overflow-hidden`}
                    >
                        <p
                            className=" flex-wrap overflow-hidden flex items-center "
                        >{i + 1}</p>
                       
                        <p
                            className={` flex-wrap overflow-hidden col-span-4 flex items-center `}
                        >{currentTime - new Date(s.createdAt).getTime() > 180000 ? s.result === "Pending" ? "Failed to run" : s.result : s.result}</p>
                        <p
                            className="flex items-center  flex-wrap overflow-hidden"
                        >{s.language}</p>
                    </div>
                ))
            }

            {
                code &&
                <div
                    className=" absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center"
                >
                    <div
                        className="  relative w-3/4 h-fit overflow-hidden rounded-xl bg-zinc-900 flex"
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

            {
                !end && 
                <div 
                onClick={()=>{
                    nextPage()
                }}
                className="w-full flex items-center justify-center"
                ><IoIosArrowDown /></div>
            }
        </div>
    )
}

export default Submissions;