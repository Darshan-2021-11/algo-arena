'use client'
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page : React.FC = ()=>{

    const [text, settext] = useState("Please do not leave the page you will be notified upon completion of verification.");

    const router = useParams();
    const routerbus = useRouter();
    
    useEffect(()=>{
        console.log(router)
        if(!router.token){
            return;
        }
        
        const token = router.token as string;
        const regex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;
        if(!regex.test(token)){
            settext("404 No such page exists.")
            return;
        }
        
        
        
        (async()=>{
                try {
              
                const res = await axios.get(`/Api/User/Auth/Verify?token=${token}`);
                console.log(res)
                if(res.data.success){
                    settext("You have been verified successfully.");
                    routerbus.push("/Sign-in")
                }else{
                    settext("Invalid request, verification vailed.");
                }
            } catch (error) {
                settext("Invalid request")
                console.log(error);
            }
            })()
            
            // useauthWorker(data);

    },[router.isReady])

    return(
        <div className=" w-screen pt-20 text-xl " >
        {text}
        </div>
    )
}

export default Page;