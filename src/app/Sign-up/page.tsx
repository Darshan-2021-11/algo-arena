'use client'
import { useState } from 'react';
import Link from "next/link";
import {useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { sendEmailVerification } from 'firebase/auth';
import {auth,firestore} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const SignUp: React.FC = () =>  {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTwo, setPasswordTwo] = useState("");
  // const [error,setError]=useState<string | null>(null);
  // const [message,setMessage]=useState<string | null>(null);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter()
  // const db = getFirestore(); 
  const handleSignUp = async () => {
   
    try {
      if (password === passwordTwo){
        const res = await createUserWithEmailAndPassword(email, password);
        // console.log({res})
        if (res?.user) {
          // Save user data to Firestore
          await setDoc(doc(firestore, 'users', res.user.uid), {
            name,
            email,
            createdAt: new Date().toISOString(),
          });

          sessionStorage.setItem('user', true);
          setName('');
          setEmail('');
          setPassword('');
          setPasswordTwo('');
          router.push('/Problems');}
      }else{
        alert("Passwords do not match");
      }
    } catch(e){
        console.error(e)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
      <h2 className="text-3xl font-bold mb-5 pb-6 text-center text-red-800 mb-4">
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
          onClick={handleSignUp}
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