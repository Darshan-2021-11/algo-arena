import { useEffect, useState } from "react";

interface nametype {
    setvalid:React.Dispatch<React.SetStateAction<boolean>>
}

const Email : React.FC<nametype> = ({setvalid}) => {
    const [error, seterror] = useState<string | null>(null);
    const [status, setstatus] = useState<boolean | null>(null);

    const validate = (email: string) => {
        const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if(!regex.test(email)){
            seterror("Invalid email.");
            setstatus(false);
            return false;
        }
        setstatus(true)
        seterror(null);
        return true;
    }


    return (
        <>
            <input
                type="text"
                placeholder="Email"
                onChange={(e) => {
                    const val = e.currentTarget.value;
                    setvalid(validate(val));
                    
                }}
                name='email'
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

export default Email;