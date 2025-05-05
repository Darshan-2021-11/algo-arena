import axios from "@/app/lib/errorhandler";
import React, { useEffect, useRef, useState } from "react";

interface nametype {
    check:boolean
    setvalid:React.Dispatch<React.SetStateAction<boolean>>
}

const Username : React.FC<nametype> = ({check, setvalid}) => {
    const [error, seterror] = useState<string | null>(null);
    const [status, setstatus] = useState<boolean | null>(null);

    const usercheck = useRef(true);
    const nextusercheck = useRef("");

    const validate = (username: string) => {
        if (!username) {
            seterror("username is required");
            setstatus(false);
            return false;
        } else if (username.length < 3 || username.length > 12) {
            seterror("username must be in between 3 to 12.")
            setstatus(false);
            return false;
        }
        check ? setstatus(null) : setstatus(true);
        seterror(null);
        return true;
    }

    const checkusername = async (username: string) => {
        try {
            usercheck.current = false;
            nextusercheck.current = "";
            setstatus(null);
            const url = "/Api/User/Auth/Exists/Username";
            const { data } = await axios.post(url, { username });
            if (!data.success) {
                seterror("Username is not available.");
                setstatus(false);
            } else {
                setstatus(true);
                seterror(null);
            }
        } catch (error: any) {
            console.log(error);
            setstatus(false);
            seterror("Username is not available.");
        } finally {
            usercheck.current = true;
            if(nextusercheck.current){
                checkusername(nextusercheck.current);
            }
        }
    }

    useEffect(()=>{
        if(status){
            setvalid(true);
        }else{
            setvalid(false);
        }
    },[status])


    return (
        <>
            <input
                type="text"
                placeholder="Username"
                onChange={(e) => {
                    const val = e.currentTarget.value;
                    const valid = validate(val);
                    if (valid && check) {
                        if (usercheck.current) {
                            const id = setTimeout(() => {
                                checkusername(val);
                                clearTimeout(id);
                            }, 400);
                        } else {
                            nextusercheck.current = val;
                        }
                    }
                }}
                name='username'
                className={` ${status !== null ? status ? "border-green-600 border" : 'border-red-600 border' : ""} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
            />
            {
                error ?
                    <div className='mb-4 text-xs text-red-700'>{error}</div>
                    :
                    <div className='h-8 w-1 '></div>
            }
        </>
    )
}

export default Username;