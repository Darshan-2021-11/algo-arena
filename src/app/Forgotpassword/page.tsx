'use client'
import {  useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { LuLoaderCircle } from "react-icons/lu";
import { generateHeader } from '../lib/customHeader';

const Forgotpassword = () => {
  const [e_error, sete_Error] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [s_msg, sets_msg] = useState<string|null>(null)


  const emailTests = [
    { test: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, msg: "Invalid email" },
  ]

  const validateInput = (email:string | undefined): boolean | undefined => {
    try {
      if (!email) {
        sete_Error("Email is required");
        return;
      }
      if (email.length < 3 || email.length > 254) {
        sete_Error("password must be between 3 to 254 letters.")
      }
      for (let i = 0; i < emailTests.length; i++) {
        if (!emailTests[i].test.test(email)) {
          sete_Error(emailTests[i].msg);
          return;
        }
      }

      return true;
    } catch (error) {
      console.log(error);
    }


  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      sete_Error(null);
      sets_msg(null);

      const data = new FormData(e.currentTarget);
      const email = data.get("email")?.toString();

      const headers = await generateHeader();
      if (!validateInput(email)) {
        return;
      }

      const response = await axios.post(
        "/Api/Auth/ForgotPassword", 
        {email},
        {
         headers
        }
      );

      if (response.data.success) {
        sets_msg(response.data.message)
      }
    } catch (err: any) {
        console.log(err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to send request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-3xl w-96 bg-opacity-50 mt-5 shadow-gray-600 shadow-xl">
        <h2 className="text-lg font-bold pb-3 text-center text-white mb-4">
          Forgot Password
        </h2>
        <p>Enter the email connected to the id a verification will be sent to you.</p>
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Email"
            name='email'
            className={`${e_error && "border-red-600 border"} w-full p-3 mt-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
          />
          {
            e_error ?
              <div className='mb-4 text-xs text-red-700'>{e_error}</div>
              :
              <div className='h-8 w-1 '></div>
          }
        
          {
            error ?
              <div className=' text-xs text-red-700 mt-4 flex items-center justify-center'>{error}</div>
              :
              <div className='h-8 w-1'></div>
          }
            {
            s_msg ?
              <div className=' text-base text-green-700 mt-4 flex items-center justify-center'>{s_msg}</div>
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
              <input type="submit" value="Request" className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500" />
          }

        </form>
        
      
      </div>
    </div>
  );
};

export default Forgotpassword;
