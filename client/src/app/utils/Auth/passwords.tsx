import { useEffect, useRef, useState } from "react";

interface nametype {
    doublecheck: boolean
    setvalid:React.Dispatch<React.SetStateAction<boolean>>
}

const Password: React.FC<nametype> = ({ setvalid, doublecheck }) => {
    const [error, seterror] = useState<string | null>(null);
    const [status, setstatus] = useState<boolean | null>(null);
    const [c_error, setc_error] = useState<string | null>(null);
    const [cstatus, setcstatus] = useState<boolean | null>(null);
    const pass = useRef("");

    const passwordTests = [
        { test: /[A-Z]/, msg: "Capital letter must be present." },
        { test: /\d/, msg: "Number must be present." },
        { test: /[a-z]/, msg: "Lower letter must be present." },
        { test: /[!@#$%^&*(),.?":{}|<>]/, msg: "Special character must be present." },
    ]


    const validate = (password: string) => {
        if (!password) {
            seterror("password is required");
            setstatus(false);
            return false;
        } else if (password.length < 6 || password.length > 12) {
            seterror("password length should be in between 6 to 12.");
            setstatus(false);
            return false;
        } else {
            for (let i = 0; i < passwordTests.length; i++) {
                if (!passwordTests[i].test.test(password)) {
                    seterror(passwordTests[i].msg);
                    setstatus(false);
                    return false;
                }
            }
        }
        setstatus(true)
        seterror(null);
        return true;
    }

    useEffect(()=>{
        if(doublecheck){
            if(status && cstatus){
                setvalid(true);
            }
        }else{
            status && (setvalid(true));
        }
    },[status,cstatus])


    return (
        <>
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => {
                    const val = e.currentTarget.value;
                    pass.current = val;
                    const v = validate(val);
                    if(v){
                        setstatus(true);
                    }else{
                        setstatus(false);
                    }
                }}
                name='password'
                className={` ${status !== null ? status ? "border-green-600 border" : 'border-red-600 border' : ""} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
            />
            {
                error ?
                    <div className='mb-4 text-xs text-red-700'>{error}</div>
                    :
                    <div className='h-8 w-1 '></div>
            }
            {
                doublecheck &&
                <>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => {
                            const val = e.currentTarget.value;
                            // valid = validate(val);
                            if (pass.current !== val) {
                                setcstatus(false);
                                setc_error("password is not equal.");
                            }else{
                                setcstatus(true);
                                setc_error(null)
                            }
                        }}
                        name="confirmpassword"
                        className={` ${cstatus !== null ? cstatus ? "border-green-600 border" : 'border-red-600 border' : ""} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
                    />
                    {
                        c_error ?
                            <div className='mb-4 text-xs text-red-700'>{c_error}</div>
                            :
                            <div className='h-8 w-1 '></div>
                    }
                </>
            }

        </>
    )
}

export default Password;