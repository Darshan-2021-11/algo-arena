"use client"
import Toggle from "@/app/utils/Auth/toggle";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface body {
    name?:string
    description?:string
    startTime?:Date
    endTime?:Date
    ispublic?:boolean
}

const Create =()=>{
    const [err, seterr] = useState<string|null>(null);
    const [load, setload] = useState(false);
    const [msg, setmsg] = useState<string|null>(null);
    const [p, setp] = useState(true);

    const formref = useRef<HTMLFormElement>(null);

    const validateinput =(e:FormData) : body | undefined=>{
        try {
            const body: body = {};

            const name = e.get("name") as string;
            if(!name){
                seterr("name is required.");
                return;
            }
            if(name.length < 1 || name.length > 30){
                seterr("name must be with in 1 to 30");
                return;
            }
            body.name = name;

            const description = e.get("description") as string;
            if(!description){
                seterr("description is required.");
                return;
            }
            if(description.length < 20 || description.length > 300){
                seterr("description must be with in 20 to 300");
                return;
            }
            body.description = description;
            
            const startdate = e.get("startdate") as string;
            if(!startdate){
                seterr("startdate is required.");
                return;
            }

            const starttime = e.get("starttime") as string;
            if(!starttime){
                seterr("starttime is required.");
                return;
            }
            const currentdate  = new Date();

            const start = new Date(`${startdate}T${starttime}`); 

            if(currentdate >= start){
                seterr("start time must be future")
                return;
            }
            
            body.startTime = start;

            const enddate = e.get("enddate") as string;
            if(!enddate){
                seterr("enddate is required.");
                return;
            }

            const endtime = e.get("endtime") as string;
            if(!endtime){
                seterr("endtime is required.");
                return;
            }

            const end = new Date(`${enddate}T${endtime}`); 
            if(end <= start) {
                seterr("end time must be later than start.")
            }
            body.endTime = end;

            return body;
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit =async(e:FormEvent<HTMLFormElement>)=>{
        try {
            seterr(null);
            setmsg(null);
            setload(true);
            e.preventDefault();
            const formdata = new FormData(e.currentTarget);
            const body = validateinput(formdata);
            if(!body){
                return;
            }
            const url = "/Api/Contests/CreateContest";
            body.ispublic = p;
            const {data} = await axios.post(url,body);
            if(data.success){
                setmsg("Contest created successfully");
                formref.current?.reset();
            }
            
        } catch (error:any) {
            console.log(error);
            seterr(error.response.data.message|| "unable to create contests")
        }finally{
            setload(false);
        }
    }

    return(
        <form ref={formref} onSubmit={handleSubmit} className="flex items-start justify-center flex-col m-3">
            <div >name</div>
            <input className=" p-1 outline-none m-1 bg-zinc-700 w-96 h-8 rounded-lg" type="text" name="name" id="" />
            <div className="mt-3">Description</div>
            <textarea cols={50} rows={10} className=" p-1 rounded-lg resize-none outline-none m-1 bg-zinc-700 " name="description" id=""></textarea>
            <div className="mt-3">Start time</div>
            <div >
            <input className=" outline-none m-1 bg-zinc-700 " type="date" name="startdate" id="" />
            <input className=" outline-none m-1 bg-zinc-700 " type="time" name="starttime" id="" />
            </div>
            <div className="mt-3">End time</div>
            <div>
            <input className=" outline-none m-1 bg-zinc-700 " type="date" name="enddate" id="" />
            <input className=" outline-none m-1 bg-zinc-700 " type="time" name="endtime" id="" />
            </div>
            <Toggle left="public" right="private" p={p} setp={setp}/>
            <div className="min-h-4 m-1 mb-2">
                <p className="text-red-600">{err}</p>
                <p className="text-green-600">{msg}</p>
            </div>
            <div className="flex">
                {
                    load ?
                    <div 
                    className="bg-blue-600 rounded-lg pl-3 pr-3 pt-2 pb-2 cursor-pointer hover:bg-blue-700 m-1 w-20 h-12 flex items-center justify-center"
                    >
                        <AiOutlineLoading3Quarters className=" animate-spin"/></div>
                    :
                    <input type="submit" value="create" className="bg-blue-600 rounded-lg pl-3 pr-3 pt-2 pb-2 cursor-pointer hover:bg-blue-700 m-1" />
                    
                }
                <Link href="/Admin/Contest" className="bg-gray-600 rounded-lg p-3 cursor-pointer hover:bg-gray-700 m-1" >Back</Link>
            </div>
        </form>
    )
}

export default Create;