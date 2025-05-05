'use client'

import { useState } from "react"
import Tags from "./tags"
import Constraints from "./constraints";
import Testcases from "./testcases";
import axios from "@/app/lib/errorhandler";
import { LuLoaderCircle } from "react-icons/lu";
import Toggle from "@/app/utils/Auth/toggle";
import { useSelector } from "react-redux";
import { useAuth } from "@/app/lib/slices/authSlice";

interface obj {
    input: string
    output: string
}

export interface body {
    title: string
    description: string
    difficulty: string
    tags: string[]
    constraints: string[]
    testcases: { input: string, output: string }[]
    timeLimit: number
    spaceLimit: number
    author:string|null
}

const Page = () => {
    const [tags, settags] = useState<string[]>([]);
    const [constraints, setconstraints] = useState<string[]>([])
    const [testcases, settestcases] = useState<obj[]>([])
    const [diff, setdiff] = useState("Easy");
    const [terr, setterr] = useState<string | null>(null);
    const [derr, setderr] = useState<string | null>(null);
    const [tagerr, settagerr] = useState<string | null>(null);
    const [cerr, setcerr] = useState<string | null>(null);
    const [testerr, settesterr] = useState<string | null>(null);
    const [error, seterr] = useState<string | null>(null);
    const [success, setsuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [p, setp] = useState(true);
    const auth = useSelector(useAuth);



    const validateInput = (e: React.FormEvent<HTMLFormElement>): body | undefined => {
        seterr(null);
        setterr(null);
        setderr(null);
        settagerr(null);
        setcerr(null);
        settesterr(null);
        const formdata = new FormData(e.currentTarget);
        const title = formdata.get("title")?.toString() || "";

        if (title.length < 3) {
            setterr("title must be longer than 3.");
            return;
        }
        const description = formdata.get("description")?.toString() || "";


        if (tags.length < 1) {
            settagerr("there must be atleast 1 tag.")
            return;
        }
        if (constraints.length < 1) {
            setcerr("there must be atleast 1 constraint.")
            return;
        }

        if (testcases.length < 1) {
            settesterr("there must be atleast 1 testcase.")
            return;
        }


        const body = {
            title,
            description,
            difficulty: diff,
            tags,
            constraints,
            testcases,
            timeLimit: Number(formdata.get("timeLimit")?.toString()),
            spaceLimit: Number(formdata.get("spaceLimit")?.toString()),
            private:!p,
            author:auth.id
        }

        return body;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true);
            e.preventDefault();
            const body = validateInput(e);
            if (!body) {
                return;
            }
            const url = "/Api/Problems/CreateProblem";

            const { data } = await axios.post(url, body);
            if (data.success) {
                setsuccess(data.message || "Problem is successfully created.");
            } else {
                seterr("something went wrong.");
            }

        } catch (error: any) {
            console.log(error)
            seterr(error.response.data.message || "Unable to add problem.");
        }finally{
            setLoading(false)
        }
    }

    return (
        <div
            className=" overflow-x-hidden w-screen h-screen pr-10 p-5 "
        >

            <form
                className="pt-14 text-black flex flex-col"
                onSubmit={(e) => {
                    handleSubmit(e)
                }}
            >
                <input
                    className=" m-3 w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="title"
                    type="text"
                    name="title"
                    maxLength={240}
                />
                {
                    terr ?
                        <div className='mb-4 text-xs text-red-700'>{terr}</div>
                        :
                        <div className='h-8 w-1 '></div>
                }
                <textarea
                    className=" m-3 resize-none w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="description"
                    name="description"
                    maxLength={1000}
                    cols={50}
                    rows={10}
                ></textarea>
                {
                    derr ?
                        <div className='mb-4 text-xs text-red-700'>{derr}</div>
                        :
                        <div className='h-8 w-1 '></div>
                }
                <div
                    className="w-full ml-3 rounded text-white "
                >difficulty</div>
                <select
                    onChange={(e) => {
                        setdiff(e.target.value);
                    }}
                    className="bg-gray-700 text-white m-3 p-3 w-full outline-none"
                >
                    <option value={"Easy"}>Easy</option>
                    <option value={"Medium"}>Medium</option>
                    <option value={"Hard"}>Hard</option>
                </select>
                <Tags tags={tags} settags={settags} />
                {
                    tagerr ?
                        <div className='mb-4 text-xs text-red-700'>{tagerr}</div>
                        :
                        <div className='h-8 w-1 '></div>
                }
                <Constraints constraints={constraints} setconstraints={setconstraints} />
                {
                    cerr ?
                        <div className='mb-4 text-xs text-red-700'>{cerr}</div>
                        :
                        <div className='h-8 w-1 '></div>
                }
                <Testcases testcases={testcases} settestcases={settestcases} />
                {
                    testerr ?
                        <div className='mb-4 text-xs text-red-700'>{testerr}</div>
                        :
                        <div className='h-8 w-1 '></div>
                }
                <div
                    className="w-full ml-3 rounded text-white "
                >in ms</div>
                <input
                    className=" m-3 w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="timeLimit"
                    type="number"
                    name="timeLimit"
                    defaultValue={1}
                    min={1}
                    max={1000}
                    onChange={(e) => {
                        if (Number(e.target.value) < 1) {
                            e.target.value = '1';
                            return;
                        }
                        if (Number(e.target.value) > 1000) {
                            e.target.value = '1000'
                        }
                    }}
                />
                <div
                    className="w-full ml-3 rounded text-white "
                >in KB</div>
                {/* <input type="radio" name="" id="" /> */}
                <div className="m-2">
                <div className="text-white mb-2 mt-2">Visibility</div>
                <Toggle left="public" right="private" p={p} setp={setp} />
                </div>
                <input
                    className=" m-3 w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="spaceLimit"
                    name="spaceLimit"
                    type="number"
                    defaultValue={16}
                    min={16}
                    max={1024}
                    onChange={(e) => {
                        if (Number(e.target.value) < 16) {
                            e.target.value = '16';
                            return;
                        }
                        if (Number(e.target.value) > 1024) {
                            e.target.value = '1024'
                        }
                    }}
                />

                {
                    error || success ?
                        error ?
                            <div className='mt-4 text-xs text-red-700'>{error}</div>
                            :
                            <div className='mt-4 text-xs text-green-700'>{success}</div>
                        :
                        <div className='h-8 w-1 '></div>
                }
                {
                    loading ?
                        <div
                        className=" m-3 resize-none w-52 p-3 flex items-center justify-center bg-blue-700 cursor-pointer hover:bg-blue-800 transition-all rounded outline-none text-white placeholder-gray-500"
                        >
                            <LuLoaderCircle
                                className=' animate-spin'
                            />
                        </div>
                        :
                        <input
                            type="submit"
                            value="create"
                            className=" m-3 resize-none w-52 p-3 bg-blue-700 cursor-pointer hover:bg-blue-800 transition-all rounded outline-none text-white placeholder-gray-500"
                        />
                }



            </form>

        </div>
    )
}

export default Page;