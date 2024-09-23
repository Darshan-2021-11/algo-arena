"use client";

import Editor from "@monaco-editor/react";
import { useState, useRef } from 'react';


import { ProblemTrailer } from '../Api/models/problemModel';

export default function IDE() {
  const [value, setValue] = useState<string>('');
  const [problems, setproblems] = useState<ProblemTrailer[]>([]);
  const editorRef = useRef();
  const onMount = (editor) => {
    editor.current = editor;
    editor.focus();
  }

  const getProblems = async() : Promise<void> =>{
    try{
      const url = `Api/Problems/GetProblemById?page=${id}`;
      console.log(url)
      const {data} = await axios.get(url);
        let newdata : Array<any> = data.problems || [];
        setproblems(newdata);
        setmaxpage(data.maxpage);
        setelem(data.lastelement);
    }catch(err){
      console.log(err);
    }
  }


  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 border-r flex flex-col">
        <h2 className="text-xl font-bold">Problem Statement</h2>
        <p>Description of the coding problem goes here.</p>
      </div>

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
                (value, event) => setValue(value)
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
