'use client'

import { login } from "@/app/lib/slices/authSlice";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Page = () => {
    const { id } = useParams();
    const [msg, setmsg] = useState<string | null>(null);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const url = `/Api/User/Auth/MagicLink/Login?t=${id}`
                    const { data } = await axios.get(url);
                    if (data.success) {
                        setmsg("logged in successfully.")
                        dispatch(login({ name: data.user.name, id: data.user.id, admin: data.user.admin }));
                        router.push("/")
                    }
                } catch (error:any) {
                    console.log(error);
                    setmsg(error.message? error.message : "Invalid request");
                }
            })()
        }
    }, [id]);
    return (
        <>
        {msg}
        </>
    )
}

export default Page;