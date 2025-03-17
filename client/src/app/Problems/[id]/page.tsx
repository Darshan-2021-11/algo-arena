"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from "next/navigation";
import { Problem } from "@/app/lib/api/problemModel";
import { v4 as uuidv4 } from 'uuid';
import CodeEditor from '../../utils/Editor';
import { useEditor } from '@/app/lib/contexts/editorContext';
import Assistant from '../../utils/Assistant';


interface resulttype {
  status:{
    id:number | null
    description:string | null
  }
  time:string
  memory:string
}


export default function IDE() {

  const { lang, value } = useEditor();

  const [Problem, setProblem] = useState<Problem>();
  const [result, setresult] = useState<resulttype[]>([]);

  const { id } = useParams();

  const [running, setrun] = useState(false);

  const failed_test : resulttype[] = [
    { status: { id:null, description: null }, time: "0.000", memory: "N/A " }
  ]
  const runcode = async () => {
    try {
      setrun(true);
      const url = '../../Api/Submissions/Run';
      const body = { id, code: value, lang };
      const header = { 'Content-Type': 'application/json' };

      const response = await axios.post(url, body, { headers: header });
      setresult(response.data.data);
    } catch (error:any) {
      let errbody = { ...failed_test[0] };
      errbody.status.description = error.response.data.err
      setresult([errbody])
      console.error(error);
    }
  };




  const getProblem = async (): Promise<void> => {
    try {
      const url = `/Api/Problems/GetProblembyId?id=${id}`;
      const { data } = await axios.get(url);
      setProblem(data.response.problem);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProblem();
  }, [])


  return (
    <>
      <div className="flex h-full w-full">
        {
          Problem ?
            <div className="w-1/2 p-4 border-r flex flex-col ">
              <div
                className="flex align-middle justify-between"
              >
                <p
                  className={` w-24 ${Problem.difficulty === 1 ? 'text-green-900' : 'text-orange-600'} `}
                >{Problem.difficulty}</p>
                <div
                  className="text-gray-500"
                >
                  {
                    Problem.topics.map((elem) => (
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
              <p>{Problem.question}</p>

              <div
                className="text-gray-400 border-gray-800 border-2 p-3 rounded-md mt-3"
              >
                {
                  Problem.sample_testcases.map(({ question, answer }) => (
                    <>
                      <pre>input : {question}</pre>
                      <p>output : {answer}</p>
                    </>
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
                    className={`flex text-white w-screen justify-evenly m-1 p-3 ${r.status.id === 3 ? 'bg-green-500' : 'bg-red-700'}`}>
                    <div style={{
                      width: '20%'
                    }}>test {i + 1}</div>
                    <div style={{
                      width: '20%'
                    }}>{r.status.description}</div>
                    <div style={{
                      width: '20%'
                    }}>{r.time}ms</div>
                    <div style={{
                      width: '20%'
                    }}>{r.memory}KB</div>
                  </div>
                ))
              }
            </div>

            <button
              className="bg-blue-700 p-2 fixed bottom-10 right-10 rounded-3xl w-fit mt-4 "
              onClick={() => {
                setresult([]);
                setrun(false)
              }}
            > go back </button>
          </div>
        }
        <div className="w-1/2 p-4 flex flex-col">

          <form className="flex-1 flex flex-col">
            <CodeEditor />

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
      <Assistant Problem={Problem}/>

    </>
  );
}
