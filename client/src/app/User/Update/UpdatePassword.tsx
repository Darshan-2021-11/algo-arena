"use client"
import { setError, setMessage } from "@/app/lib/slices/popupSlice";
import Password from "@/app/utils/Auth/passwords";
import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from "react-redux";

const UpdatePassword = () => {

    const [passwordvalid, setpv] = useState(false);
    const [load, setload] = useState(false);
    // const inputref = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

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
            if (data.success) {
                dispatch(setMessage(data.message));
            }
        } catch (error: any) {
            if (error.message) {
                dispatch(setError(error.message));
            } else if (error.response.data.message) {
                dispatch(setError(error.response.data.message));
            } else {
                dispatch(setError("unable to update email"));
            }
            console.log(error);
        } finally {
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
                        load
                            ?
                            <button className=" bg-purple-900  cursor-not-allowed ml-2 mt-2 pl-3 pr-3 pt-2 pb-2 rounded-md w-20 h-10 flex items-center justify-center "><AiOutlineLoading3Quarters className="animate-spin" /></button>

                            :
                            <input type="submit" value="update" className=" bg-purple-900 ml-2 mt-2 pl-3 pr-3 pt-2 pb-2 rounded-md " />

                        :
                        <button className=" bg-purple-900 opacity-45 cursor-not-allowed ml-2 mt-2 pl-3 pr-3 pt-2 pb-2 rounded-md ">update</button>

                }
            </div>
        </form>
    )
}

export default UpdatePassword;