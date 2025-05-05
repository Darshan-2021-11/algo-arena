'use client'
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "@/app/lib/errorhandler";
import { LuLoaderCircle } from "react-icons/lu";


interface body {
    password: string | undefined,
    confirmpassword: string | undefined,
}


const Page: React.FC = () => {
    const [p_error, setp_Error] = useState<string | null>(null);
    const [p2_error, setp2_Error] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setloading] = useState(false);
    const [success, setsuccess] = useState<string | null>(null);
    const [valid, setvalid] = useState(false);
    const [text, settext] = useState("");

    const router = useParams();

    useEffect(() => {
        if (!router.token) {
            settext("404 No such page exists")
            return;
        }

        const token = router.token as string;
        const regex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;
        if (!regex.test(token)) {
            setvalid(false);
            settext("404 No such page exists")
            return;
        }
        setvalid(true);

    }, [router.isReady])

    const passwordTests = [
        { test: /[A-Z]/, msg: "Capital letter must be present." },
        { test: /\d/, msg: "Number must be present." },
        { test: /[a-z]/, msg: "Lower letter must be present." },
        { test: /[!@#$%^&*(),.?":{}|<>]/, msg: "Special character must be present." },
    ]

    const validateInput = (data: body): boolean | undefined => {
        try {

            const password = data.password;
            if (!password) {
                setp_Error("password is required");
                return;
            } else if (password.length < 6 || password.length > 12) {
                setp_Error("password length should be in between 6 to 12.");
                return;
            } else {
                for (let i = 0; i < passwordTests.length; i++) {
                    if (!passwordTests[i].test.test(password)) {
                        setp_Error(passwordTests[i].msg);
                        return;
                    }
                }
            }

            if (password !== data.confirmpassword) {
                setp2_Error("password must be same");
                return;
            }
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setloading(true);
            setp2_Error(null);
            setp_Error(null);
            setsuccess(null);
            setError(null);
            const formdata = new FormData(e.currentTarget);
            const obj = {
                password: formdata.get("password")?.toString(),
                confirmpassword: formdata.get("confirmpassword")?.toString()
            }
            const passed = validateInput(obj);
            if (!passed) {
                return;
            }
            const res = await axios.post(`/Api/User/Auth/ChangePassword`,{newPassword:obj.password,token:router.token});
            console.log(res)
            if (res.data.success) {
                setsuccess(res.data.message);
            } else {
                setError("unable to update password");
            }
        } catch (error: any) {
            console.log(error);
            setError(error.response.data.message)
            // setError(error.)
        } finally {
            setloading(false)
        }
    }

    return (
        <>
            {
                valid ?
                    <div className="h-screen flex items-center justify-center">
                        <div className="bg-gray-800 p-10 rounded-3xl w-96 bg-opacity-50 mt-5 shadow-gray-600 shadow-xl">
                            <h2 className="text-3xl font-bold pb-3 text-center text-white mb-4">
                                Change Password
                            </h2>

                            <form
                                onSubmit={(e) => handleSignIn(e)}
                            >

                                <input
                                    type="password"
                                    placeholder="Password"
                                    name='password'
                                    className={`${p_error && "border-red-600 border"} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
                                />
                                {
                                    p_error ?
                                        <div className=' text-xs text-red-700 mb-4'>{p_error}</div>
                                        :
                                        <div className='h-8 w-1'></div>
                                }
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    name='confirmpassword'
                                    className={` ${p2_error && 'border-red-600 border'} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
                                />
                                {
                                    p2_error ?
                                        <div className='mb-4 text-xs text-red-700'>{p2_error}</div>
                                        :
                                        <div className='h-8 w-1 '></div>
                                }

                                {
                                    success || error ?
                                        <>
                                            {
                                                success ?
                                                    <div className=' text-xs text-green-700 mt-4 flex items-center justify-center'>{success}</div>
                                                    :
                                                    <div className=' text-xs text-red-700 mt-4 flex items-center justify-center'>{error}</div>

                                            }
                                        </>
                                        :
                                        <div className='h-8 w-1'></div>
                                }
                                {
                                    loading ?
                                        <div
                                            className='w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 flex items-center justify-center'
                                        >
                                            <LuLoaderCircle
                                                className=' animate-spin'

                                            />
                                        </div>
                                        :
                                        <input type="submit" value="submit" className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500" />
                                }

                            </form>

                        </div>
                    </div>
                    :
                    <div className=" w-screen pt-20 h-screen " >
                        {text}
                    </div>
            }



        </>
    )
}

export default Page;