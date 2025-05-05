'use client'
import {  useState } from 'react';
import axios from "@/app/lib/errorhandler";
import { LuLoaderCircle } from "react-icons/lu";
import { generateHeader } from '../../lib/customHeader';
import Email from '../../utils/Auth/email';
import Link from 'next/link';

const Forgotpassword = () => {
  const [emailvalid, setev] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [s_msg, sets_msg] = useState<string|null>(null)
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if(!emailvalid){
        return;
      }
      setLoading(true);
      sets_msg(null);

      const data = new FormData(e.currentTarget);
      const email = data.get("email")?.toString();

      const headers = await generateHeader();
      

      const response = await axios.post(
        "/Api/User/Auth/ForgotPassword", 
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
    <div 
    style={{
      height:"calc( 100vh - 64px )"
    }}
    className=" flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-3xl w-96 bg-opacity-50 mt-5 shadow-gray-600 shadow-xl">
      
        <p
        className=' text-sm mb-3'
        >Enter the email connected to the account.</p>
        <form
          onSubmit={handleSubmit}
        >
        <Email setvalid={setev}/>
        
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
        <Link className="text-sm flex items-center justify-center mt-4 text-right" href={"/Forgotpassword"}>
          Another way to login? <span className="pl-1 underline text-red-700">try another way</span>
        </Link>
      
      </div>
    </div>
  );
};

export default Forgotpassword;
