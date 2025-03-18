'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { LuLoaderCircle } from "react-icons/lu";


const SignIn = () => {
  const [e_error, sete_Error] = useState<string | null>(null);
  const [p_error, setp_Error] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const passwordTests = [
    { test: /[A-Z]/, msg: "Capital letter must be present." },
    { test: /\d/, msg: "Number must be present." },
    { test: /[a-z]/, msg: "Lower letter must be present." },
    { test: /[!@#$%^&*(),.?":{}|<>]/, msg: "Special character must be present." },
  ]

  const emailTests = [
    { test: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, msg: "Invalid email" },
  ]

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
    e.preventDefault();
    setLoading(true);
    sete_Error(null);
    setp_Error(null);

    const data = new FormData(e.currentTarget);
    const objectdata = {
      email: data.get("email")?.toString(),
      password: data.get("password")?.toString()
    };

    const email = objectdata.email;
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

    const password = objectdata.password;
    if (!password) {
      setp_Error("Password is required");
      return;
    }
    if (password.length < 6 || password.length > 12) {
      setp_Error("password must be between 6 to 12 letters.")
    }
    for (let i = 0; i < passwordTests.length; i++) {
      if (!passwordTests[i].test.test(password)) {
        setp_Error(passwordTests[i].msg);
        return;
      }
    }

      const response = await axios.post("/Api/Auth/Login", data);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); 
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        router.push("/Problems")
      }
    } catch (err:any) {
      if (err.response && err.response.data && err.response.data.message) {
        // setError(err.response.data.message); // Server error message
      } else {
        // setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold pb-3 text-center text-white mb-4">
          AlgoArena
        </h2>

        <form
          onSubmit={handleSignIn}
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
          <input
            type="password"
            placeholder="Password"
            name='password'
            className={`${p_error && "border-red-600 border"} w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500`}
          />
          {
            p_error ?
              <div className=' text-xs text-red-700 mb-4'>{p_error}</div>
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
              <input type="submit" value="Login" className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500" />
          }

        </form>

      </div>
    </div>
  );
};

export default SignIn;
