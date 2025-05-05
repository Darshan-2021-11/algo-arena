"use client"
import { updateEmail, useAuth } from "@/app/lib/slices/authSlice";
import { setError, setMessage } from "@/app/lib/slices/popupSlice";
import Email from "@/app/utils/Auth/email";
import axios from "@/app/lib/errorhandler";
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
            const url = "/Api/User/Update/email";
            const { data } = await axios.post(url, body);
            if (data.success) {
                dispatch(updateEmail(data.val));
                dispatch(setMessage(data.message))
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

export default UpdateEmail;