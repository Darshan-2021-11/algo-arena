"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface LeaderBoardData {
    totalQuestionSolved:number,
    name:string
}

const Page: React.FC = () => {

    

    const [users, setusers] = useState<LeaderBoardData[]>([]);

    const fetchData =async()=>{
        try {
            const url = "Api/LeaderBoard";
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
     <div className='bg-gray-900 h-full w-full'>
          <div className='flex w-full  p-2 justify-evenly'>
            <p className='w-24'>sl no</p>
            <p className='w-9/12'>user</p>
            <p className='w-9/12'>score</p>

          </div>
          {
            users.map((user,i)=>(
                <div 
                key={uuidv4()}
                className={`flex w-full  p-2 justify-evenly ${!(i&1) ? "bg-gray-600": "bg-transparent"} `}>
                <p className='w-24'>{i+1}</p>
                <p className='w-9/12'>{user.name}</p>
                <p className='w-9/12'>{user.totalQuestionSolved}</p>
    
              </div>
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
