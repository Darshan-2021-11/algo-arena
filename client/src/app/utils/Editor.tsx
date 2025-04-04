import React, { useState } from "react";
import Editor from "@monaco-editor/react";

interface editortype {
  lang:string
  value:string
  setValue:(payload:string)=>void
  setlang:(payload:string)=>void
}

const CodeEditor : React.FC<editortype> =({setValue,setlang, lang, value})=>{
    

    const onMount = (editor: any) => {
        editor.current = editor;
        editor.focus();
    }

    return ( <div className="flex-1 mb-4 text-black ">
        <select id="language-select "
          onChange={(e) => {
            setlang(e.target.value)
          }}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
        </select>
        <Editor
          line={1}
          height="70vh"
          defaultLanguage={lang}
          language={lang}
          theme="vs-dark"
          defaultValue={`# Write your code here`}
          value={value}
          onChange={
            (value, event) => setValue(value || "")
          }
          onMount={onMount}
        />
      </div>)
}

export default CodeEditor;