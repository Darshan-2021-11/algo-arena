import axios from "axios";
import { useRef, useState } from "react";

const Username = () => {
    const [u_error, setu_Error] = useState<string | null>(null);
    const [status, setstatus] = useState<boolean | null>(null);

    const usercheck = useRef(true);
    const nextusercheck = useRef("");

    const validateUsername = (username: string) => {
        if (!username) {
            setu_Error("username is required");
            setstatus(false);
            return false;
        } else if (username.length < 3 || username.length > 12) {
            setu_Error("username must be in between 3 to 12.")
            setstatus(false);
            return false;
        }
        setstatus(null)
        setu_Error(null);
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
                setu_Error("Username is not available.");
                setstatus(false);
            } else {
                setstatus(true);
                setu_Error(null);
            }
        } catch (error: any) {
            console.log(error);
            setstatus(false);
            setu_Error("Username is not available.");
        } finally {
            usercheck.current = true;
            if(nextusercheck.current){
                checkusername(nextusercheck.current);
            }
        }
    }


    return (
        <>
            <input
                type="text"
                placeholder="Name"
                onChange={(e) => {
                    const val = e.currentTarget.value;
                    if (validateUsername(val)) {
                        if (usercheck.current) {
                            const id = setTimeout(() => {
                                checkusername(val);
                                clearTimeout(id);
                            }, 200);
                        } else {
                            nextusercheck.current = val;
                        }
                    }
                }}
                name='username'
                className={` ${status !== null ? status ? "border-green-600 border" : 'border-red-600 border' : ""} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
            />
            {
                u_error ?
                    <div className='mb-4 text-xs text-red-700'>{u_error}</div>
                    :
                    <div className='h-8 w-1 '></div>
            }
        </>
    )
}

export default Username;