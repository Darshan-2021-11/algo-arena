'use client'
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from "axios";

const SignUp: React.FC = () =>  {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // const [error,setError]=useState<string | null>(null);
  // const [message,setMessage]=useState<string | null>(null);
 
  const router = useRouter()
  // const db = getFirestore(); 
  // const handleSignUp = async () => {
   
  //   try {
  //     if (password === passwordTwo){
  //       // const res = await createUserWithEmailAndPassword(email, password);
  //       // console.log({res})
  //       // const user= res.user;
  //       // await sendEmailVerification(user)
  //       // if (res?.user) {
  //       //   // Save user data to Firestore
  //       //   // await setDoc(doc(firestore, 'users', res.user.uid), {
  //       //   //   name,
  //       //   //   email,
  //       //   //   createdAt: new Date().toISOString(),
  //       //   // });
  //       // localStorage.setItem("signupData",
  //       //   JSON.stringify({name,email})
  //       // )

  //         // sessionStorage.setItem('user', true);
  //         setName('');
  //         setEmail('');
  //         setPassword('');
  //         setPasswordTwo('');
  //         alert("Registration Successfull! Please check your email for Verification")
  //         router.push('/Sign-in');}
  //         else{
  //           alert("already email")
  //         }
  //     }else{
  //       alert("Passwords do not match");
  //     }
  //   } catch(e){
  //       console.error(e)
  //   }
  // };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setSuccess(""); // Reset success state

    try {
      if (password === passwordTwo){
      console.log(name, email, password)


      const response = await axios.post("/Api/Auth/Register", {
        name,
        email,
        password,
      });
      console.log(response)
      if (response.status === 201) {
        setSuccess("User registered successfully!");
        alert("Registeration successful!,Check Your mail to verify");
        router.push("/Sign-in")
        setName("");
        setEmail("");
        setPassword("");
        setPasswordTwo("");
      }
    }else{
              alert("Passwords do not match");
             }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Display server error message
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
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
