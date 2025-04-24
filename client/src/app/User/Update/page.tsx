"use client"
import { updateEmail, useAuth } from "@/app/lib/slices/authSlice";
import Email from "@/app/utils/Auth/email";
import ProfileImage from "@/app/utils/Auth/image";
import Password from "@/app/utils/Auth/passwords";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {

    const [emailvalid, setev] = useState(false);
    const [passwordvalid, setpv] = useState(false);

    const authdata = useSelector(useAuth);

    const dispatch = useDispatch();

    const updateemail = async (e: FormEvent<HTMLFormElement>) => {
        try {
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
        }
    }

    const updatepassword = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const formdata = new FormData(e.currentTarget);
            const body = { email: formdata.get("password")?.toString() }
            if (!passwordvalid) {
                return;
            }
            const url = "/Api/User/Update";
            const { data } = await axios.post(url, body);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div
            className="w-screen bg-black"
            style={{
                height: "calc( 100vh - 64px )"
            }}
        >
            <ProfileImage update={true} size={"big"}/>


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
                            <button className=" bg-purple-900 opacity-45 cursor-not-allowed ml-2 mt-2 pl-3 pr-3 pt-2 pb-2 rounded-md ">update</button>
                    }
                </div>
            </form>

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
                            <button className=" bg-purple-900 opacity-45 cursor-not-allowed ml-2 mt-2 pl-3 pr-3 pt-2 pb-2 rounded-md ">update</button>
                    }
                </div>
            </form>

        </div>
    )
}

export default Page;