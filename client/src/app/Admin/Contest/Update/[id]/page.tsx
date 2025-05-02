"use client"
import Toggle from "@/app/utils/Auth/toggle";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface body {
    name?: string
    description?: string
    startTime?: string
    endTime?: string
    ispublic?: boolean
}

const Create = () => {
    const [err, seterr] = useState<string | null>(null);
    const [load, setload] = useState(false);
    const [msg, setmsg] = useState<string | null>(null);
    const [p, setp] = useState(true);
    const [original, setoriginal] = useState<{ name: string, description: string, startTime: string, endTime: string, _id:string, ispublic: boolean } | null>(null);

    const params = useParams();
    const formref = useRef<HTMLFormElement>(null);

    const validateinput = (e: FormData): body | undefined => {
        try {
            const body: body = {};

            const name = e.get("name") as string;
            if (!name) {
                seterr("name is required.");
                return;
            }
            if (name.length < 1 || name.length > 30) {
                seterr("name must be with in 1 to 30");
                return;
            }
            body.name = name;

            const description = e.get("description") as string;
            if (!description) {
                seterr("description is required.");
                return;
            }
            if (description.length < 20 || description.length > 300) {
                seterr("description must be with in 20 to 300");
                return;
            }
            body.description = description;

            const startdate = e.get("startdate") as string;
            if (!startdate) {
                seterr("startdate is required.");
                return;
            }

            const starttime = e.get("starttime") as string;
            if (!starttime) {
                seterr("starttime is required.");
                return;
            }
            const currentdate = new Date();

            const sstr = `${startdate}T${starttime}`;
            const start = new Date(sstr);

            if (currentdate >= start) {
                seterr("start time must be future")
                return;
            }

            body.startTime = sstr;

            const enddate = e.get("enddate") as string;
            if (!enddate) {
                seterr("enddate is required.");
                return;
            }

            const endtime = e.get("endtime") as string;
            if (!endtime) {
                seterr("endtime is required.");
                return;
            }
            const estr = `${enddate}T${endtime}`;
            const end = new Date(estr);
            console.log(end,start)
            if (end <= start) {
                seterr("end time must be later than start.")
                return;
            }
            body.endTime = estr;

            return body;
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            seterr(null);
            setmsg(null);
            setload(true);
            e.preventDefault();
            if(!original){
                return
            }
            const formdata = new FormData(e.currentTarget);
            const body = validateinput(formdata);
            if (!body) {
                return;
            }
            body.ispublic = !p;
            console.log(body)
            if( body.name === original.name && body.description === original.description && body.startTime === original.startTime && body.endTime === original.endTime && body.ispublic === original.ispublic ){
                seterr("Change something to update.")
                return;
            }
            const url = `/Api/Contests/UpdateContest?id=${original._id}`;
            const { data } = await axios.post(url, body);
            if (data.success) {
                setmsg("Contest updated successfully");
                formref.current?.reset();
            }

        } catch (error: any) {
            console.log(error);
            seterr(error.response.data.message || "unable to create contests")
        } finally {
            setload(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const url = `/Api/Contests/GetContest?id=${params.id}`;
                const { data } = await axios.get(url);
                console.log(data)
                if (data.success) {
                    console.log(typeof(data.body.ispublic),data.body.ispublic)
                    if(data.body.ispublic){
                        setp(false)
                    }else{
                        setp(true)
                    }
                    setoriginal(data.body);
                }
            } catch (error) {
                console.log(error)
            }

        })()
    }, [])

    return (
        <div
            className="w-screen flex items-center justify-center"
            style={{
                height: "calc( 100vh - 64px )"
            }}
        >

            {
                original &&
                <form ref={formref} onSubmit={handleSubmit} className="shadow-2xl bg-zinc-900 shadow-zinc-900 p-2 rounded-2xl flex items-start justify-center flex-col m-3">
                    <div >name</div>
                    <input defaultValue={original.name} className=" p-1 outline-none m-1 bg-zinc-700 w-96 h-8 rounded-lg" type="text" name="name" id="" />
                    <div className="mt-3">Description</div>
                    <textarea defaultValue={original.description} cols={50} rows={10} className=" p-1 rounded-lg resize-none outline-none m-1 bg-zinc-700 " name="description" id=""></textarea>
                    <div className="mt-3">Start time</div>
                    <div >
                        <input defaultValue={original.startTime.split("T")[0]} className=" outline-none m-1 bg-zinc-700 " type="date" name="startdate" id="" />
                        <input defaultValue={original.startTime.split("T")[1].substring(0, 8)} className=" outline-none m-1 bg-zinc-700 " type="time" name="starttime" id="" />
                    </div>
                    <div className="mt-3">End time</div>
                    <div>
                        <input defaultValue={original.endTime.split("T")[0]} className=" outline-none m-1 bg-zinc-700 " type="date" name="enddate" id="" />
                        <input defaultValue={original.endTime.split("T")[1].substring(0, 8)} className=" outline-none m-1 bg-zinc-700 " type="time" name="endtime" id="" />
                    </div>
                    <Toggle left="private" right="public" p={p} setp={setp} />
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
                                    <AiOutlineLoading3Quarters className=" animate-spin" /></div>
                                :
                                <input type="submit" value="update" className="bg-blue-600 rounded-lg pl-3 pr-3 pt-2 pb-2 cursor-pointer hover:bg-blue-700 m-1" />

                        }
                        <Link href="/Admin/Contest" className="bg-gray-600 rounded-lg p-3 cursor-pointer hover:bg-gray-700 m-1" >Back</Link>
                    </div>
                </form>
            }

        </div>

    )
}

export default Create;