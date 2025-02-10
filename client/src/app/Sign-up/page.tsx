'use client'
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SignUp: React.FC = () =>  {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTwo, setPasswordTwo] = useState("");
  // const [error,setError]=useState<string | null>(null);
  // const [message,setMessage]=useState<string | null>(null);
  // const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter()
  // const db = getFirestore(); 
  const registerUser = async (): Promise<void> => {
    try {
      console.log("hello")
      const url = 'Api/Authentication/Register';
      const { data } = await axios.post(url, { name, email, password });
      alert(data.message);
      router.push('/Problems')
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordTwo) {
      alert("Passwords do not match");
      return;
    }
    await registerUser();
  };

  return (
    <div className="h-4/5 flex items-center justify-center ">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
      <h2 className="text-3xl font-bold mb-5 pb-6 text-center text-red-800 ">
            AlgoArena
          </h2>
        {/* <h1 className="text-white text-2xl mb-5">Sign Up</h1> */}
        <input
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
    />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
         <input 
          type="password" 
          placeholder="Confirm Password" 
          value={passwordTwo} 
          onChange={(e) => setPasswordTwo(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSubmit}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
        <div className='mt-5 ml-3'><Link className="text-sm  pt-5 ml-8 text-right" href={"/Sign-in"}>
            Already have an account? <span className="underline text-red-700">Login</span>
          </Link></div>
      </div>
    </div>
  );
};

export default SignUp;
