'use client'

import { FormEvent, useEffect, useRef, useState } from "react"
import axios from "axios";
import Tags from "../../Addproblem/tags";
import Constraints from "../../Addproblem/constraints";
import { LuLoaderCircle } from "react-icons/lu";
import { Problem } from "@/app/lib/api/problemModel";
import { useParams } from "next/navigation";
import Toggle from "@/app/utils/Auth/toggle";

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
}

const ProblemDescription: React.FC<{ Problem: Problem }> = ({ Problem }) => {
    const [tags, settags] = useState<string[]>([]);
    const [constraints, setconstraints] = useState<string[]>([])
    const [testcases, settestcases] = useState<obj[]>([])
    const [diff, setdiff] = useState("Easy");
    const [terr, setterr] = useState<string | null>(null);
    const [derr, setderr] = useState<string | null>(null);
    const [tagerr, settagerr] = useState<string | null>(null);
    const [cerr, setcerr] = useState<string | null>(null);
    const [error, seterr] = useState<string | null>(null);
    const [success, setsuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [title, settitle] = useState("");
    const [des, setdes] = useState("");
    const [open, setopen] = useState(false);
    const [tl, settl] = useState<number|undefined>(1);
    const [sl, setsl] = useState<number|undefined>(16);
    const [itl, setitl] = useState<number|undefined>(1);
    const [isl, setisl] = useState<number|undefined>(16);
    const formref = useRef<HTMLFormElement>(null);
    const params = useParams();
    const [id,setid] = useState("");
    const [problem, setproblem] = useState(Problem);
    const [p, setp] = useState(false);

    useEffect(()=>{
        if(typeof(params.id) === "string"){
            setid(params.id);
        }
    },[])


    const validateInput = (e: React.FormEvent<HTMLFormElement>): body | undefined => {
        seterr(null);
        setterr(null);
        setderr(null);
        settagerr(null);
        setcerr(null);
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


        const body = {
            title,
            description,
            difficulty: diff,
            tags,
            constraints,
            testcases,
            timeLimit: Number(formdata.get("timeLimit")?.toString()),
            spaceLimit: Number(formdata.get("spaceLimit")?.toString()),
            private:p
        }

        return body;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setLoading(true);
            if (!open) {
                seterr("Nothing to update.");
                return;
            }
            const body = validateInput(e);
            if (!body) {
                return;
            }
            
            const reqbody = {
                id,
                problem:body
            }

            const url = "/Api/Problems/UpdateProblem";

            const { data } = await axios.post(url, reqbody);
            if (data.success) {
                const newbody : Problem = {_id:Number(id),...body};
                setproblem(newbody);
                setsuccess(data.message || "Problem is successfully created.");
            } else {
                seterr("something went wrong.");
            }

        } catch (error: any) {
            console.log(error)
            seterr(error.response.data.message || "Unable to add problem.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (problem) {
            settags(problem.tags);
            setconstraints(problem.constraints);
            settestcases(problem.testcases);
            setdiff(problem.difficulty);
            settitle(problem.title);
            setdes(problem.description);
            setsl(problem.spaceLimit);
            settl(problem.timeLimit);
            setisl(problem.spaceLimit);
            setitl(problem.timeLimit);
            setp(!!problem.private);
        }
    }, [problem]);

    useEffect(()=>{
        if(formref.current){
            const fakeEvent = {
                preventDefault:()=>console.log("prevent default behaviour"),
                currentTarget:formref.current
            } as React.FormEvent<HTMLFormElement>;
            match(fakeEvent);
        }
    },[p]);

    const match = (e: FormEvent<HTMLFormElement>) => {
        const arr = Array.from(e.currentTarget.children);
        let changed = false;

        console.log(p,problem.private)
        if(p != problem.private){
            changed = true;
        }
        arr.map((a) => {
            if(changed){
                return;
            }
            switch (a.id) {
                case "title":
                    {
                        const elem = a as HTMLInputElement;
                        if(title !== elem.value){
                            changed = true;
                            return;
                        }
                    }
                    break;
                case "description":
                    {
                        const elem = a as HTMLInputElement;
                        if(des !== elem.value){
                            changed = true;
                            return;
                        }
                    }
                    break;
                case "difficulty":
                    {
                        const elem = a as HTMLSelectElement;
                        if(diff !== elem.value){
                            changed = true;
                            return;
                        }
                    }
                    break;
                case "tags":
                    {
                        const parent = a as HTMLElement;
                        const arr = Array.from(parent.children);
                        let elem : HTMLElement | null = arr.find((a)=>a.id === "tagvalue") as HTMLElement | null ;
                        if(elem){
                            const childarr = Array.from(elem.children);
                            childarr.map((c)=>{
                                const val = c.children[0].innerHTML
                                if(!tags.find((t)=>t === val )){
                                    changed = true;
                                    return;
                                }
                            })
                        }
                    }
                    break;
                case "constraints":
                    {
                        const parent = a as HTMLElement;
                        const arr = Array.from(parent.children);
                        let elem : HTMLElement | null = arr.find((a)=>a.id === "constraintvalue") as HTMLElement | null ;
                        if(elem){
                            const childarr = Array.from(elem.children);
                            childarr.map((c)=>{
                                const val = c.children[0].innerHTML
                                if(!constraints.find((t)=>t === val )){
                                    changed = true;
                                    return;
                                }
                            })
                        }
                    }
                    break;
                case "timeLimit":
                    {
                        const elem = a as HTMLInputElement;
                        if(Number(elem.value) !== tl){
                            changed = true;
                            return;
                        }
                    }
                    break;
                case "spaceLimit":
                    {
                        const elem = a as HTMLInputElement;
                        if(Number(elem.value) !== sl){
                            changed = true;
                            return;
                        }
                    }
                    break;

                default:
                    break;
            }

        })

        if(changed){
            setopen(true);
        }else{
            setopen(false);
        }
    }



    return (
        <div
            className=" overflow-x-hidden w-screen h-screen pr-10 p-5 "
        >

            <form
                className="pt-14 text-black flex flex-col"
                onSubmit={handleSubmit}
                onChange={match}
                ref={formref}
            >
                <input
                    className=" m-3 w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="title"
                    type="text"
                    name="title"
                    id="title"
                    maxLength={240}
                    defaultValue={title}
                    onChange={(e) => {
                        if (title !== e.currentTarget.value) {
                            setopen(true);
                        } else {
                            setopen(false);
                        }
                    }}
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
                    id="description"
                    maxLength={1000}
                    cols={50}
                    rows={10}
                    defaultValue={des}
                    onChange={(e) => {
                        if (des !== e.currentTarget.value) {
                            setopen(true);
                        } else {
                            setopen(false);
                        }
                    }}
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
                    id="difficulty"
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
                <div
                    className="w-full ml-3 rounded text-white "
                >in s</div>
                <input
                    className=" m-3 w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="timeLimit"
                    type="number"
                    name="timeLimit"
                    id="timeLimit"
                    value={itl}
                    min={1}
                    max={1000}
                    onChange={(e) => {
                        if (Number(e.target.value) < 1) {
                            setitl(1);
                            return;
                        }
                        setitl(Number(e.target.value));
                        if (Number(e.target.value) > 1000) {
                           setitl(1000)
                        }
                    }}
                />
                <div
                    className="w-full ml-3 rounded text-white "
                >in KB</div>
                <input
                    className=" m-3 w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="spaceLimit"
                    name="spaceLimit"
                    type="number"
                    id="spaceLimit"
                    value={isl}
                    min={16}
                    max={1024}
                    onChange={(e) => {
                        if (Number(e.target.value) < 1) {
                            setisl(1);
                            return;
                        }
                        setisl(Number(e.target.value));
                        if (Number(e.target.value) > 1000) {
                           setisl(1000)
                        }
                    }}
                />
                <Toggle left="private" right="public" p={p} setp={setp}/>

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
                    open ?
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
                                value="update"
                                className={` cursor-pointer m-3 resize-none w-52 p-3 bg-blue-700 hover:bg-blue-800 transition-all rounded outline-none text-white placeholder-gray-500 `}
                            />
                        :
                        <div
                            className={` flex items-center justify-center hover:cursor-not-allowed m-3 resize-none w-52 p-3 bg-blue-300  hover:bg-blue-300 transition-all rounded outline-none text-white placeholder-gray-500 `}
                        >update</div>
                }

            </form>

        </div>
    )
}

export default ProblemDescription;