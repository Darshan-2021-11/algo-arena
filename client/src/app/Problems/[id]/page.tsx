"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useParams } from "next/navigation";
import { Problem } from "@/app/lib/api/problemModel";
import { v4 as uuidv4, v4 } from 'uuid';
import CodeEditor from '../../utils/Editor';
import { useEditor } from '@/app/lib/contexts/editorContext';
import Assistant from '../../utils/Assistant';
import { AiOutlineLoading } from 'react-icons/ai';


interface resulttype {
  status: {
    id: number | null
    description: string | null
  }
  time: string
  memory: string
  errmsg?: string
}

interface sizetype {
  width: number
  height?: number
  w:number
}


export default function IDE() {

  const { lang, value, setlang, setValue } = useEditor();

  const [Problem, setProblem] = useState<Problem>();
  const [result, setresult] = useState<resulttype[]>([]);
  const tokens = useRef<string[]>([]);
  const idref = useRef(null) as React.MutableRefObject<NodeJS.Timeout | null>;
  const [coderun, setcoderun] = useState(false);
  const problemId = useRef(null) as React.MutableRefObject<string | null>;

  // size control
  const [size, setsize] = useState<sizetype>({ width: 0, height: 0,w:window.innerWidth });
  const [move, setmove] = useState(false);

  useEffect(() => {
    const newsize = {
      width: window.innerWidth / 2,
      w:window.innerWidth
    }
    setsize(newsize);
  }, [])

  useEffect(() => {

    const handlemove = (e: MouseEvent) => {
      console.log(e.movementX)
      const s = { ...size };
      s.width += e.movementX;
      console.log(s)
      setsize(s);
    }

    const handleleave = () => {
      setmove(false);
    }

    const handleresize = ()=>{
      const p = size.width / size.w * 100;
      const newsize = window.innerWidth*(p/100);
      setsize({width:newsize,w:window.innerWidth})
    }

    if (move) {

      window.addEventListener("mousemove", handlemove);
      window.addEventListener("mouseleave", handleleave)
      window.addEventListener("mouseup", handleleave)

      return (() => {
        window.removeEventListener("mousemove", handlemove);
        window.removeEventListener("mouseleave", handleleave)
        window.removeEventListener("mouseup", handleleave)


      })
    }
    window.addEventListener("resize", handleresize);
    return (() => {
      window.removeEventListener("resize", handleresize);
    })
  }, [move, size])
  // 

  const { id } = useParams();

  const [running, setrun] = useState(false);

  const failed_test: resulttype[] = [
    { status: { id: null, description: null }, time: "0.000", memory: "N/A " }
  ]
  const runcode = async () => {
    try {
      setrun(true);
      const res: any[] = ["sd"];
      setresult(res)
      const url = '/Api/Submissions/Run';
      const body = { id, code: value, lang };
      const header = { 'Content-Type': 'application/json' };

      const response = await axios.post(url, body, { headers: header });
      setresult(response.data.tokens)
      tokens.current = response.data.tokens;
      problemId.current = response.data.problemid;
      setcoderun(true);
    } catch (error: any) {
      console.log(error)
      let errbody = { ...failed_test[0] };
      errbody.status.description = error?.response?.data?.err || "unable to run code"
      errbody.status.id = 11
      setresult([errbody])
      console.error(error);
    }
  };

  const getResult = async () => {
    if (tokens.current.length == 0) {
      if (idref.current) {
        clearInterval(idref.current)
        setcoderun(false)
      }
    }
    const updatedTokens: string[] = [];
    for (let i = 0; i < tokens.current.length; i++) {
      try {
        const submissionurl = `http://localhost:2358/submissions/${tokens.current[i]}?base64_encoded=false&wait=false`;
        const data = await axios.get(submissionurl);
        if (data.status === 200 && problemId.current) {
          const storeResultUrl = `/Api/Problems/StoreResult?pid=${problemId.current}&msg=${data.data.status.description}`
          const d = await axios.get(storeResultUrl);
          const res = { status: { description: data.data.status.description, id: data.data.status.id }, time: data.data.time, memory: data.data.memory, errmsg: data.data.stderr }
          if (d.data.success) {
            const results = [...result];
            let newrs = []
            newrs = results.map((t: any) => {
              if (typeof (t) === "string") {
                t = res;
              }
              return t;
            })
            setresult(newrs)
          } else {
            res.status.id = 11;
            res.status.id = "unable to get result"
          }


        }
        if (data.status !== 200) {
          updatedTokens.push(tokens.current[i]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    tokens.current = updatedTokens;

  }

  useEffect(() => {
    if (coderun) {
      const id = setInterval(() => {
        getResult();
      }, 1000);
      idref.current = id;
    }

  }, [coderun])




  const getProblem = async (): Promise<void> => {
    try {
      const url = `/Api/Problems/GetProblembyId?id=${id}`;
      const { data } = await axios.get(url);
      setProblem(data.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProblem();
  }, [])


  return (
    <div
    className={`${move&&"cursor-col-resize"}`}
    >
      {
        Problem ?
          <>
            <div className="flex h-full w-full overflow-hidden"
            style={{
              maxHeight:'100vh'
            }}
            >
              {
                Problem ?
                  <div className=" border  border-zinc-600 rounded-xl m-1 bg-zinc-900 p-4 flex flex-col no-scrollbar overflow-scroll"
                    style={{
                      width: size.width,
                      maxHeight: "85vh"

                    }}
                  >
                    <div
                      className="flex align-middle justify-between"
                    >
                      <p
                        className={` w-24 font-medium ${Problem.difficulty === "Easy" ? 'text-green-900' : Problem.difficulty === "Medium" ? 'text-orange-600' : "text-red-600"} `}

                      >{Problem.difficulty}</p>
                      <div
                        className="text-gray-500"
                      >
                        {
                          Problem.tags.map((elem) => (
                            <span

                              key={uuidv4()}
                              className="ml-4"
                            >{elem}</span>
                          ))
                        }
                      </div>
                    </div>
                    <h2
                      className="text-xl font-bold m-5"
                    >{Problem.title}</h2>
                    <p>{Problem.description}</p>

                    <div
                      className="text-gray-400 border-gray-800 border-2 p-3 rounded-md mt-3"
                    >
                      {
                        Problem.testcases.map(({ input, output }) => (
                          <div
                          key={v4()}
                          >
                            <pre>input : {input}</pre>
                            <p>output : {output}</p>
                          </div>
                        ))
                      }
                    </div>



                  </div>
                  :
                  //loading screen
                  <div className="w-1/2 p-4 border-r flex flex-col ">
                    <h2 className="text-xl font-bold"></h2>
                    <p></p>
                  </div>

              }
              <div
                onMouseDown={() => setmove(true)}
                className={` relative ${move && "bg-blue-500"}  w-1 cursor-col-resize bg-transparent hover:bg-blue-500 rounded-lg  mr-2 ml-2`}
               style={{
                height:'80vh'
               }}
              ></div>

              {
                running &&
                <div
                  style={{
                    zIndex: 100000
                  }}

                  className=" bg-black h-screen w-screen flex flex-col float-right items-center  fixed t-0 l-0 ">

                  <div className=" overflow-y-scroll h-4/6">

                    <div
                      key={uuidv4()}
                      className={`flex w-screen justify-evenly m-1 p-3 text-white `}>
                      <div
                        style={{
                          width: '20%'
                        }}
                      >test no</div>
                      <div
                        style={{
                          width: '20%'
                        }}
                      >description</div>
                      <div
                        style={{
                          width: '20%'
                        }}
                      >time</div>
                      <div
                        style={{
                          width: '20%'
                        }}
                      >memory</div>
                    </div>
                    {
                      result.map((r, i) => (
                        <div
                        key={uuidv4()}
                        
                        >
                          <div
                            className={`flex text-white w-screen justify-evenly m-1 p-3 ${r?.status?.id ? r.status.id === 3 ? 'bg-green-500' : 'bg-red-700' : "bg-gray-400"}`}>
                            <div style={{
                              width: '20%'
                            }}>test {i + 1}</div>
                            <div style={{
                              width: '20%'
                            }}>{r?.status?.description ? r.status.description : <AiOutlineLoading className=' animate-spin' />}</div>
                            <div style={{
                              width: '20%'
                            }}>{r?.time ? r.time : "--"}ms</div>
                            <div style={{
                              width: '20%'
                            }}>{r?.memory ? r.memory : "--"}KB</div>
                            {
                              <p></p>
                            }
                          </div>
                          {/* <p
                        className='bg-green-600'
                        >
                        {r.errmsg}
                        </p> */}
                        </div>
                      ))
                    }

                  </div>

                  <button
                    className="bg-blue-700 p-2 fixed bottom-10 right-10 rounded-3xl w-fit mt-4 "
                    onClick={() => {
                      setresult([]);
                      setrun(false)
                      idref.current = null;
                    }}
                  > go back </button>
                </div>
              }
              <div className=" p-4 flex flex-col border border-zinc-600 rounded-xl bg-zinc-900 overflow-hidden"
                style={{ width: innerWidth - size.width }}
              >

                <form className="flex-1 flex flex-col ">
                  <CodeEditor setValue={setValue} setlang={setlang} lang={lang} value={value} />

                  <div className="flex justify-between pt-2">
                    <div className="flex items-center space-x-5"></div>
                    <div className="flex-shrink-0">
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        onClick={(e) => {
                          e.preventDefault();
                          runcode();
                        }}
                      >
                        Run
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <Assistant Problem={Problem} />

            {/* <div
              onMouseDown={() => setmove(true)}
              className=' absolute w-0.5 h-screen cursor-move bg-transparent hover:bg-white rounded-lg  mr-2 ml-2'
              style={{
                left: size.x,
                top: size.y
              }}
            >

            </div> */}
          </>
          :
          <div>Invalid page </div>
      }


    </div>
  );
}
