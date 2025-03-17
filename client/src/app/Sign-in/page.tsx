'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter()

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error message
    setLoading(true); // Show loading state

    try {
      const response = await axios.post("/Api/Auth/Login", { email, password });

      if (response.status === 200) {
        // Handle successful login
        localStorage.setItem("token", response.data.token); // Store token in localStorage or cookies
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        router.push("/Problems")
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Server error message
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
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
