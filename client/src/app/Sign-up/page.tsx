'use client'
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { LuLoaderCircle } from 'react-icons/lu';
import { generateHeader } from '../lib/customHeader';

interface body {
  email: string | undefined,
  password: string | undefined,
  username: string | undefined,
  confirmpassword: string | undefined,
}

const SignUp: React.FC = () => {
  const [e_error, sete_Error] = useState<string | null>(null);
  const [u_error, setu_Error] = useState<string | null>(null);
  const [p_error, setp_Error] = useState<string | null>(null);
  const [p2_error, setp2_Error] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

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
        setu_Error("username is required");
        return;
      } else if (username.length < 3 || username.length > 12) {
        setu_Error("username must be in between 3 to 12.")
        return;
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
      setu_Error(null);
      setp2_Error(null);
      setp_Error(null);

      const formdata = new FormData(e.currentTarget);

      const objectdata = {
        email: formdata.get("username")?.toString(),
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
      console.log(headers)

      const response = await axios.post("/Api/Auth/Register", objectdata, { headers }) as { message: string, success: boolean };
      if (response.success === true) {
        router.push("/Sign-in")
      } else {
        alert("Passwords do not match");
      }
    } catch (err: any) {
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
    <div className="h-4/5 flex items-center justify-center ">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-5 pb-6 text-center text-red-800 ">
          AlgoArena
        </h2>
        {/* <h1 className="text-white text-2xl mb-5">Sign Up</h1> */}
        <form
          onSubmit={(e) => {
            // e.preventDefault();
            handleSignUp(e);
          }}
        >

          <input
            type="text"
            placeholder="Name"
            name='username'
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          {
            u_error ?
              <div className='mb-4 text-xs text-red-700'>{u_error}</div>
              :
              <div className='h-8 w-1 '></div>
          }
          <input
            type="email"
            placeholder="Email"
            name='email'
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
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
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
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
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          {
            p2_error ?
              <div className='mb-4 text-xs text-red-700'>{p2_error}</div>
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
          {
            error ?
              <div className='mb-4 text-xs text-red-700'>{error}</div>
              :
              <div className='h-8 w-1 '></div>
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
