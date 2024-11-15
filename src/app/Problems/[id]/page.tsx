"use client";

import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { useParams } from "next/navigation";
import { Problem } from "@/app/Api/models/problemModel";




export default function IDE() {
  const [value, setValue] = useState<string>('');
  const [Problem, setProblem] = useState<Problem>();
  const {id} = useParams();
  const katexref = useRef();
  const editorRef = useRef();
  const onMount = (editor: any) => {
    editor.current = editor;
    editor.focus();
  }

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
      

      <div className="w-1/2 p-4 flex flex-col">
        <form className="flex-1 flex flex-col">
          <div className="flex-1 mb-4">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              defaultValue="// Write your code here"
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
