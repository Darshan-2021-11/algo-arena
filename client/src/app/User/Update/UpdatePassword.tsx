"use client"
import Password from "@/app/utils/Auth/passwords";
import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UpdatePassword = () => {

    const [passwordvalid, setpv] = useState(false);
    const [load, setload] = useState(false);
    // const inputref = useRef<HTMLInputElement>(null);

    const updatepassword = async (e: FormEvent<HTMLFormElement>) => {
        try {
            setload(true);
            e.preventDefault();
            const formdata = new FormData(e.currentTarget);
            const body = { newPassword: formdata.get("password")?.toString() }
            if (!passwordvalid) {
                return;
            }
            const url = "/Api/User/Update/password";
            const { data } = await axios.post(url, body);
            console.log(data)
        } catch (error) {
            console.log(error);
        }finally{
            setload(false)
        }
    }


    return (


        <form
            onSubmit={updatepassword}
        >
            <div
                className="w-screen flex items-start justify-start"
            >
                <div className="flex flex-col items-start justify-center w-2/3 m-2">
                    <Password doublecheck={false} setvalid={setpv} />

                </div>
                {
                    passwordvalid ?
                        <input type="submit" value="update" className=" bg-purple-900 ml-2 mt-2 pl-3 pr-3 pt-2 pb-2 rounded-md " />
                        :
                        load
                            ?
                            <button className=" bg-purple-900  cursor-not-allowed ml-2 mt-2 pl-3 pr-3 pt-2 pb-2 rounded-md w-20 h-10 flex items-center justify-center "><AiOutlineLoading3Quarters className="animate-spin" /></button>

                            :
                            <button className=" bg-purple-900 opacity-45 cursor-not-allowed ml-2 mt-2 pl-3 pr-3 pt-2 pb-2 rounded-md ">update</button>

                }
            </div>
        </form>
    )
}

export default UpdatePassword;