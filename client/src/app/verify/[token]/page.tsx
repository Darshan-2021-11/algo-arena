'use client'
import { useWorker } from "@/app/lib/contexts/workerContext";
import { setError } from "@/app/lib/slices/popupSlice";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import style from './style.module.css'

const Page : React.FC = ()=>{

    const {useauthWorker} = useWorker();
    const router = useParams();
    
    useEffect(()=>{
        try {
            if(!router.token){
                return;
            }

            const token = router.token as string;
            const regex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;
            if(!regex.test(token)){
                return;
            }

            const data = {
                token,
                verify:true
            }
            
            useauthWorker(data);

        } catch (error) {
            console.log(error);
        }
    },[router.isReady])

    return(
        <div className={style.verifypage}>
        Please do not leave the page you will be notified upon completion of verification.
        </div>
    )
}

export default Page;