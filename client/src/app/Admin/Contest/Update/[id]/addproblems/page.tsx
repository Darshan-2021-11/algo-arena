"use client"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoAddOutline } from "react-icons/io5";

const Contest = () => {

    const currentpage = useRef(1);
    const [end, setend] = useState(false);
    const [problems, setproblems] = useState<{_id:string, title:string}[]>([]);

    const Getallproblems = async() => {
        try {
            if(end){
                return;
            }

            const url = `/Api/Problems/Getprivateproblems?p=${currentpage}`;
            const {data} = await axios.get(url);

            if(data.success){
                problems.push(data.Problems);
                if(data.end){
                    setend(true);
                    currentpage.current++;
                }   
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        Getallproblems();

        document.addEventListener("scrollend",Getallproblems);
        return(()=>{
            document.removeEventListener("scrollend",Getallproblems);
        })
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between bg-gray-500 m-1 rounded-xl shadow-md shadow-gray-600">
                <p className="pl-1 text-xl">
                    contests
                </p>
                <div className="flex pl-3 pr-3 pt-2 pb-2 items-center justify-center bg-gray-700 w-fit rounded-xl m-1 shadow-sm shadow-gray-900 cursor-pointer">add<IoAddOutline className=" text-xl" /></div>
            </div>


        </div>
    )
}

export default Contest;