import React, { createContext, ReactNode, useContext, useState } from "react";

interface editorContextType {
    lang:string
    value:string
    setValue:(payload:string)=>void
    setlang:(payload:string)=>void
}

const editorContext = createContext<editorContextType | null>(null);

const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
    const [lang, setlang] = useState("python");
    const [value, setValue] = useState<string>('');
    
    
    return (
        <editorContext.Provider value={{lang, value, setValue, setlang}}>
            {children}
        </editorContext.Provider>
    )
}

export default EditorProvider;

export const useEditor = () => {
    const editor = useContext(editorContext);
    if (!editor) {
        throw new Error("useEditor can only be used inside EditorProvider");
    }
    return editor;
}