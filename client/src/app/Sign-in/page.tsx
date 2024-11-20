'use client'
import { useState } from 'react';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth, firestore} from '@/app/Firebase/config'
import { useRouter } from 'next/navigation';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { User } from 'firebase/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()

  const handleSignIn = async () => {
    try {

        const res = await signInWithEmailAndPassword(email, password);
        console.log({res});
        const user = res.user;
        if(user.emailVerified){
          const signupData = localStorage.getItem("signupData")
          
          const {
            name =""
          }= signupData ? JSON.parse(signupData) : {};
          const userDoc = await getDoc(doc(firestore,'users',user.uid));

              if(!userDoc.exists()){
               await setDoc(doc(firestore, 'users', user.uid), {
                       name,
                       email : user.email,
                       createdAt: new Date().toISOString()
               });
        }
        sessionStorage.setItem('user', true)
          setEmail('');
          setPassword('');
          router.push('/Problems')

        } else{
          alert("verify your email first")
        }
       
       
    }catch(e){
        console.error(e)
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
      <h2 className="text-3xl font-bold mb-2 pb-3 text-center text-red-800 mb-4">
            AlgoArena
          </h2>
        {/* <h1 className="text-white text-2xl mb-5">Sign In</h1> */}
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
        <button 
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
