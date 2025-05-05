"use client"
import axios from '../lib/errorhandler';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../lib/slices/authSlice';
import Link from 'next/link';

interface LeaderBoardData {
  score:number,
    name:string,
    id:string
}

const Page: React.FC = () => {

    const {id} = useSelector(useAuth);

    const [users, setusers] = useState<LeaderBoardData[]>([]);
    console.log(users,id)

    const fetchData =async()=>{
        try {
            const url = "/Api/LeaderBoard";
            const data = await axios.get(url);
            setusers(data.data.users);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    

    useEffect(()=>{
        fetchData()
    },[])

  return (
     <div className='bg-gray-900 h-full max-w-full '>
          <div className='flex w-full  p-2 justify-evenly'>
            <p className='w-24'>sl no</p>
            <p className='w-9/12'>user</p>
            <p className='w-9/12'>score</p>

          </div>
          {
            users.map((user,i)=>(
              user.id === id ?
              <div 
              key={uuidv4()}
              className={`flex w-full mt-2 rounded-xl p-2 justify-evenly bg-green-500`}>
              <p className='w-24'>{i+1}</p>
                <p className='w-9/12'>{user.name}</p>
              <p className='w-9/12'>{user.score}</p>
  
            </div>
              :
                <Link 
                href={`/User/${user.id}`}
                key={uuidv4()}
                className={`flex w-full mt-2 hover:bg-white transition-all hover:text-black rounded-xl p-2 justify-evenly ${ !(i&1) ? "bg-gray-600": "bg-transparent"}`}>
                <p className='w-24'>{i+1}</p>
                  <p className='w-9/12'>{user.name}</p>
                <p className='w-9/12'>{user.score}</p>
    
              </Link>
            ))
          }
        </div>
    // <div className=''>
    // <div className='flex flex-col justify-center '>
    //     {
    //     users.map((user)=>(
    //         <div key={uuidv4()} className='flex'>
    //         <p>{user.name}</p>
    //         <p>{user.totalQuestionSolved}</p>
    //         </div>
    //     ))
    //     }
    // </div>
    // </div>
  );
}

export default Page;
