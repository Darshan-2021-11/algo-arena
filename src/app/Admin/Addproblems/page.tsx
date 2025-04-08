'use client';
import { useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { v4 } from "uuid";
import { RxCross2, RxCheck } from "react-icons/rx";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type TestCase = {
    input: string;
    output: string;
};

type Problem = {
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
    constraints: string[];
    testcases: TestCase[];
    timeLimit: number;
    spaceLimit: number;
};

type ProblemList = Problem[];

const Addproblems = () => {
    const [name, setname] = useState<string | null>(null);
    const [problems, setproblems] = useState<ProblemList>([]);
    const [success, setsuccess] = useState<string | null>(null);
    const [err, seterr] = useState<string | null>(null);
    const [load, setload] = useState(false);


    const inputref = useRef<HTMLInputElement | null>(null);

    const allowedType = [".json"];

    const clearData = () => {
        setproblems([]);
        setname(null);
        if (inputref.current) {
            inputref.current.value = ""
        }
    }

    const uploadData = async () => {
        try {
            setload(true);
            const url = "/Api/Problems/CreateProblems";

            const { data } = await axios.post(url, problems);
            if (data.success) {
                setsuccess(data.message || "Problem is successfully created.");
                clearData();
            } else {
                seterr("something went wrong.");
            }

        } catch (error) {
            console.log(error)
        } finally {
            setload(false);
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const value = e.target.files?.[0];
            let allowed = false;

            for (let i = 0; i < allowedType.length; i++) {
                if (value?.name.endsWith(allowedType[i])) {
                    allowed = true;
                    break;
                }
            }

            if (!allowed) {
                console.log("not allowed bro");
                e.target.value = "";
                return;
            }
            value?.name && setname(value?.name);
            if (value) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const text = e.target?.result as string;
                        if (text) {
                            const jsondata = JSON.parse(text);
                            setproblems(jsondata);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                };
                reader.onerror = (e) => {
                    console.log(e);
                };
                reader.readAsText(value);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-end bg-gray-900 p-5">
            <input
                onChange={handleChange}
                type="file"
                name=""
                className="w-0"
                id="filei"
                ref={inputref}
            />

            {
                load ?

                    <>
                        <label
                            className="cursor-pointer hover:scale-105 transition-all m-3 absolute right-0 bottom-0 rounded-lg bg-blue-700 w-10 h-10 flex items-center justify-center"
                            htmlFor="filei"
                            title="upload"
                        >
                            <AiOutlineLoading3Quarters className=" animate-spin" />
                        </label>
                    </>

                    :

                    <>
                        {
                            name &&
                            <div
                                title="upload"
                                className="cursor-pointer hover:scale-105 transition-all m-3 absolute right-0 bottom-28 rounded-lg bg-green-700 w-10 h-10 flex items-center justify-center"
                                onClick={uploadData}
                            >
                                <RxCheck className="scale-150" />
                            </div>
                        }

                        {
                            name &&
                            <div
                                title="clear"
                                className="cursor-pointer hover:scale-105 transition-all m-3 absolute right-0 bottom-14 rounded-lg bg-red-700 w-10 h-10 flex items-center justify-center"
                                onClick={clearData}
                            >
                                <RxCross2 className="scale-150" />
                            </div>
                        }

                        <label
                            className="cursor-pointer hover:scale-105 transition-all m-3 absolute right-0 bottom-0 rounded-lg bg-blue-700 w-10 h-10 flex items-center justify-center"
                            htmlFor="filei"
                            title="upload"
                        >
                            <MdFileUpload className="scale-150" />
                        </label>
                    </>
            }

            <div className="text-2xl font-bold font-sans mb-4 text-white">
                {name ? name : "File Name"}
            </div>
            <div className="h-4/5 w-4/5 bg-gray-100 text-gray-900 overflow-y-auto p-5 rounded-lg shadow-inner">
                {problems.map((p) => (
                    <div
                        key={v4()}
                        className="mb-6 p-4 bg-white rounded-lg shadow-md"
                    >
                        <h2 className="text-xl font-semibold mb-3">Title: {p.title}</h2>
                        <p className="mb-2">
                            <span className="font-bold">Description: </span> {p.description}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold">Difficulty: </span> {p.difficulty}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold">Tags: </span>{" "}
                            {p.tags.map((t) => (
                                <span
                                    key={v4()}
                                    className="inline-block bg-blue-600 text-white rounded-full px-3 py-1 mr-2 text-sm"
                                >
                                    {t}
                                </span>
                            ))}
                        </p>
                        <div className="mb-2">
                            <span className="font-bold">Testcases:</span>
                            {p.testcases.map((t) => (
                                <div
                                    key={v4()}
                                    className="border border-gray-500 rounded p-3 my-2 bg-gray-100 shadow-sm"
                                >
                                    <p className="mb-1">
                                        <span className="font-semibold">Input:</span> {t.input}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Output:</span> {t.output}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Constraints:</span>
                            <ul className="list-disc list-inside">
                                {p.constraints.map((t) => (
                                    <li key={v4()}>{t}</li>
                                ))}
                            </ul>
                        </div>
                        <p className="mb-1">
                            <span className="font-bold">Time Limit:</span> {p.timeLimit} ms
                        </p>
                        <p>
                            <span className="font-bold">Space Limit:</span> {p.spaceLimit} KB
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Addproblems;