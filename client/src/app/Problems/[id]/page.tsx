"use client";

import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { useParams } from "next/navigation";
import { Problem } from "@/app/Api/models/problemModel";
import { v4 as uuidv4 } from 'uuid';
import { stringify } from "querystring";

export default function IDE() {
  const [value, setValue] = useState<string>('');
  const [Problem, setProblem] = useState<Problem>();
  const [result, setresult] = useState([]);
  const {id} = useParams();
  const onMount = (editor: any) => {
    editor.current = editor;
    editor.focus();
  }
  const [running, setrun] = useState(false);
  const runcode = async () => {
    try {
      setrun(true);
        const url = '../../Api/Submissions/Run';
        const body = {
          id,
          code: value
        };
        const header = { 'Content-Type': 'application/json' };

        const response = await axios.post(url, body, { headers: header });
        console.log(response.data);
        setresult(response.data.data);

    } catch (error) {
        console.error(error);
    }finally{
      // setrun(false);
    }
};


  const getProblem = async() : Promise<void> =>{
    try{
      const url = `/Api/Problems/GetProblembyId?id=${id}`;
      const {data} = await axios.get(url);
      setProblem(data.response.problem);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getProblem();
  },[])

  useEffect(()=>{
    console.log(running)
  },[running])


  return (
    <div className="flex h-screen pt-16">
      {
        Problem ?
      <div className="w-1/2 p-4 border-r flex flex-col">
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
          Problem.topics.map((elem)=>(
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
            Problem.sample_testcases.map(({question, answer})=>(
              <>
              <p>input : {question}</p>
              <p>output : {answer}</p>
              </>
            ))
          }
        </div>
      </div>
        :
        //loading screen
        <div className="w-1/2 p-4 border-r flex flex-col">
        <h2 className="text-xl font-bold"></h2>
        <p></p>
      </div>

      }
      
      {
              running &&
              <div 
              style={{
                zIndex:100000
              }}
              onClick={()=>{
                setresult([]);
                setrun(false)
              }}
              className=" bg-black h-screen w-screen  fixed t-0 l-0">
                {
                  result.map((r,i)=>(
                    <div 
                    key={uuidv4()}
                    className={`flex w-11/12 justify-evenly m-4 p-4 bg-${r.status.id === 3 ? 'green-500' : 'red-500'}`}>
                      <div>test {i+1}</div>
                      <div>{r.status.description}</div>
                    </div>
                  ))
                }
                {/* <div 
                    className={`text-white mt-3 pt-1 pb-1 flex `}
                    >
                      <div className="w-32">
                      time
                      </div>

                      <div>
                        memory
                      </div>

                      <div>
                        message
                      </div>

                      <div>status</div>

                    </div> */}
                {/* {
                  result.length > 0 && result.map((r)=>(
                    <div 
                    className={`text-white mt-3 pt-1 pb-1 flex justify-evenly ${r.status.id=== 3 ? 'bg-green-500' : 'bg-red-600'}`}
                    >
                      <p className=" max-w-12">
                      {r.time}
                      </p>

                      <p>
                        {r.memory}
                      </p>

                      <p>
                        {r.message}
                      </p>

                      <p>{r.status.description}</p>

                    </div>
                  ))
                } */}
              </div>
}
      <div className="w-1/2 p-4 flex flex-col">
    
              <form className="flex-1 flex flex-col">
          <div className="flex-1 mb-4">
            <Editor
              line={1}
              height="80vh"
              defaultLanguage="python"
              theme="vs-dark"
              defaultValue={`//write your code here
                
                `}
              value={value}
              onChange={
                (value, event) => setValue(value || "")
              }
              onMount={onMount}
            />
          </div>
          <div className="flex justify-between pt-2">
            <div className="flex items-center space-x-5"></div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                onClick={(e)=>{
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
  );
}
