'use client'
import { useRef, useState } from 'react';
import Link from "next/link";
import axios from "axios";
import { LuLoaderCircle } from 'react-icons/lu';
import { generateHeader } from '../lib/customHeader';
import Username from '../utils/Auth/username';
import Email from '../utils/Auth/email';
import Password from '../utils/Auth/passwords';


const SignUp: React.FC = () => {
  const [success, setsuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uservalid, setuv] = useState<boolean >(false);
  const [emailvalid, setev] = useState<boolean >(false);
  const [passwordvalid, setpv] = useState<boolean >(false);

  

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if(!emailvalid || !uservalid || !passwordvalid){
        return;
      }
      setError(null);
      setLoading(true);
      setsuccess(null);

      const formdata = new FormData(e.currentTarget);

      const objectdata = {
        email: formdata.get("email")?.toString(),
        password: formdata.get("password")?.toString(),
        username: formdata.get("username")?.toString(),
        confirmpassword: formdata.get('confirmpassword')?.toString()
      }

      delete objectdata.confirmpassword;
      const headers = await generateHeader();
      
      const response = await axios.post("/Api/User/Auth/Register", objectdata, { headers }) as { data:{message: string, success: boolean} };
      if (response.data.success === true) {
        setsuccess(response.data.message)
        e.currentTarget.reset();
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
    <div 
    className="flex items-center justify-center"
    style={{
      height:"calc( 100vh - 64px )"
    }}
    >
      <div className="bg-gray-800 p-10 rounded-3xl w-96 bg-opacity-60 shadow-gray-600 shadow-xl ">
        <h2 className="text-3xl font-bold mb-5 pb-6 text-center text-white ">
          Sign Up
        </h2>
        <form
          onSubmit={(e) => {
            handleSignUp(e);
          }}
        >

          <Username check={true} setvalid={setuv}/>
          <Email setvalid={setev} />
          <Password setvalid={setpv} doublecheck={true}/>
         

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
