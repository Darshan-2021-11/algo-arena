'use client'
import React, { createContext, ReactNode, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError, setMessage } from "../slices/popupSlice";
import { login } from "../slices/authSlice";
import { useRouter } from "next/navigation";
import { errorhandler } from "../errorhandler";
import { authEnd, authInit, useProcess } from "../slices/processSlice";


interface UserContextType {
    startauthWorker:Function,
    stopauthWorker:Function,
    useauthWorker:Function
}

interface MyComponentProps { children: ReactNode}

const workerContext = createContext<UserContextType | undefined>(undefined);

const WorkerProvider:React.FC<MyComponentProps> = ({children})=>{
    const {authprocess} = useSelector(useProcess);
    const authWorkerRef = useRef<Worker | null>(null);
    const URL = '/workers/worker.js';

    const router = useRouter()

    const dispatch = useDispatch();
    

    const startauthWorker =()=>{
        try {
            if(authWorkerRef.current) return;
                 const webworker = new Worker(URL,{type:'module'});
                 authWorkerRef.current = webworker;
        } catch (error) {
            console.log(error);
        }
    }

    const stopauthWorker =()=>{
        try {
            if(authWorkerRef.current){
                authWorkerRef.current.terminate();
                authWorkerRef.current = null;
            }
        } catch (error) {
            console.log(error);
        }
    }



    const useauthWorker =async(objectdata : object)=>{
        
        const stringdata = JSON.stringify(objectdata);
        const url = '/API/User/Auth';

        const response = await fetch(url,{
          method:'POST',
          headers:{
            "Content-Type":"application/json"
          },
          body:stringdata
        });
        const result = await response.json();
        if(!result){
            throw new Error('Authentication failed')
        }
        
        if(result.username && result.email && result.fullname && result.type){
            dispatch(login(result));
            // router.replace('/userprofile')
            dispatch(setMessage(result.message))
        }
        return result;
            
    }

    return (
        <workerContext.Provider value={{startauthWorker, stopauthWorker, useauthWorker}}>
            {children}
        </workerContext.Provider>
    )
}

const useWorker = ()=>{
    const context = useContext(workerContext);
    if(!context){
        throw new Error("use worker must be used within a workerprovider");
    }
    return context;
}

export { useWorker, WorkerProvider}