'use client'
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { LuLoaderCircle } from "react-icons/lu";
import { useDispatch } from 'react-redux';
import { login } from '@/app/lib/slices/authSlice';
import { generateHeader } from '@/app/lib/customHeader';
import Link from 'next/link';
import Password from '@/app/utils/Auth/passwords';
import Email from '@/app/utils/Auth/email';


const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setsuccess] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [namevalid, setnv] = useState(false);
  const [passwordvalid, setpv] = useState(false);

  const router = useRouter();


  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!namevalid || !passwordvalid){
        return;
      }
        setLoading(true);
      setsuccess(null);
      setError(null);

      const data = new FormData(e.currentTarget);
      const objectdata = {
        email: data.get("email")?.toString(),
        password: data.get("password")?.toString()
      };

      const headers = await generateHeader();


      const response = await axios.post(
        "/Api/User/Auth/Login",
        objectdata,
        {
          headers
        }
      );
      if (response.data.success) {
        setsuccess(response.data.message);
        dispatch(login({ name: response.data.user.name, id: response.data.user.id, admin: response.data.user.admin }));
        router.push("/Problems")
      }
    } catch (err: any) {
      console.log(err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center"
    style={{
      height:"calc( 100vh - 64px )"
    }}
    >
      <div className="bg-gray-800 p-10 rounded-3xl w-96 bg-opacity-50 mt-5 shadow-gray-600 shadow-xl">
        <h2 className="text-3xl font-bold pb-3 text-center text-white mb-4">
          Log in with Email
        </h2>

        <form
          onSubmit={handleSignIn}
        >
            <Email setvalid={setnv}/>
          <Password doublecheck={false} setvalid={setpv}/>
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
              <input type="submit" value="Login" className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500" />
          }

        </form>

        <Link className="text-sm flex items-center justify-center mt-4 text-right" href={"/Forgotpassword"}>
          Another way to login? <span className="pl-1 underline text-red-700">try another way</span>
        </Link>
       
      </div>
    </div>
  );
};

export default SignIn;
