'use client'
import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import axios from "axios";
import { LuLoaderCircle } from 'react-icons/lu';
import { generateHeader } from '../lib/customHeader';
import Username from './username';

interface body {
  email: string | undefined,
  password: string | undefined,
  username: string | undefined,
  confirmpassword: string | undefined,
}

const SignUp: React.FC = () => {
  const [e_error, sete_Error] = useState<string | null>(null);
  const [success, setsuccess] = useState<string | null>(null);
  const [p_error, setp_Error] = useState<string | null>(null);
  const [p2_error, setp2_Error] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const passwordTests = [
    { test: /[A-Z]/, msg: "Capital letter must be present." },
    { test: /\d/, msg: "Number must be present." },
    { test: /[a-z]/, msg: "Lower letter must be present." },
    { test: /[!@#$%^&*(),.?":{}|<>]/, msg: "Special character must be present." },
  ]

  const validateInput = (data: body): boolean | undefined => {
    try {
      const username = data.username;
      if (!username) {
        return ;
    } else if (username.length < 3 || username.length > 12) {
        return ;
    }

      const email = data.email;
      if (!email) {
        sete_Error("email is required.");
        return;
      } else if (email.length < 3 || email.length > 254) {
        sete_Error("Invalid email");
        return;
      }

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

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError(null);
      setLoading(true);
      sete_Error(null);
      setp2_Error(null);
      setp_Error(null);
      setsuccess(null);

      const formdata = new FormData(e.currentTarget);

      const objectdata = {
        email: formdata.get("email")?.toString(),
        password: formdata.get("password")?.toString(),
        username: formdata.get("username")?.toString(),
        confirmpassword: formdata.get('confirmpassword')?.toString()
      }
      const valid = validateInput(objectdata);
      if (!valid) {
        return;
      }

      delete objectdata.confirmpassword;
      const headers = await generateHeader();
      
      const response = await axios.post("/Api/User/Auth/Register", objectdata, { headers }) as { data:{message: string, success: boolean} };
      if (response.data.success === true) {
        setsuccess(response.data.message)
      } else {
        setError("something went wrong")
      }
    } catch (err: any) {
      console.log(err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); 
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-3xl w-96 bg-opacity-60 shadow-gray-600 shadow-xl ">
        <h2 className="text-3xl font-bold mb-5 pb-6 text-center text-white ">
          Sign Up
        </h2>
        {/* <h1 className="text-white text-2xl mb-5">Sign Up</h1> */}
        <form
          onSubmit={(e) => {
            // e.preventDefault();
            handleSignUp(e);
          }}
        >

          <Username/>
          <input
            type="email"
            placeholder="Email"
            name='email'
            className={`${e_error&& 'border-red-600 border'} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
          />
          {
            e_error ?
              <div className='mb-4 text-xs text-red-700'>{e_error}</div>
              :
              <div className='h-8 w-1 '></div>
          }
          <input
            type="password"
            placeholder="Password"
            name='password'
            className={`${e_error&& 'border-red-600 border'} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
          />
          {
            p_error ?
              <div className='mb-4 text-xs text-red-700'>{p_error}</div>
              :
              <div className='h-8 w-1 '></div>
          }
          <input
            type="password"
            placeholder="Confirm Password"
            name='confirmpassword'
            className={` ${p2_error&& 'border-red-600 border'} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
          />
          {
            p2_error ?
              <div className='mb-4 text-xs text-red-700'>{p2_error}</div>
              :
              <div className='h-8 w-1 '></div>
          }
           {
            error || success ?
            error ?
              <div className='mb-4 text-xs text-red-700'>{error}</div>
              :
              <div className='mb-4 text-xs text-green-700'>{success}</div>
              :
              <div className='h-8 w-1 '></div>
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
              <input type="submit" value="Sign Up" className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500" />
          }
         
        </form>
        <div className='mt-5 ml-3'><Link className="text-sm  pt-5 ml-8 text-right" href={"/Sign-in"}>
          Already have an account? <span className="underline text-red-700">Login</span>
        </Link></div>
      </div>
    </div>
  );
};

export default SignUp;
