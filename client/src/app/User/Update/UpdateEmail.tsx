"use client"
import { updateEmail, useAuth } from "@/app/lib/slices/authSlice";
import Email from "@/app/utils/Auth/email";
import axios from "axios";
import { FormEvent, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

const UpdateEmail = () => {

    const [emailvalid, setev] = useState(false);
    const [load, setload] = useState(false);

    const authdata = useSelector(useAuth);

    const dispatch = useDispatch();

    const updateemail = async (e: FormEvent<HTMLFormElement>) => {
        try {
            setload(true);
            e.preventDefault();
            const formdata = new FormData(e.currentTarget);
            const body = { email: formdata.get("email")?.toString() }
            if (!emailvalid) {
                return;
            }
            const url = "/Api/User/Update";
            const { data } = await axios.post(url, body);
            if (data.success) {
                dispatch(updateEmail(data.val));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setload(false);
        }
    }

    return (
        <form
            onSubmit={updateemail}
        >
            <div
                className="w-screen flex items-start justify-start"
            >
                <div className="flex flex-col items-start justify-center m-2 w-2/3">
                    <Email setvalid={setev} defaultval={authdata.email ? authdata.email : ""} />

                </div>

                {
                    emailvalid ?
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

export default UpdateEmail;