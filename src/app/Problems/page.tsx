'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link';
import { ProblemTrailer } from '../Api/models/problemModel';
const page = () => {

  const [page, setpage] = useState(1);
  const [problems, setproblems] = useState<ProblemTrailer[]>([]);
  const [maxpage, setmaxpage] = useState(1);
  const [lastelem, setelem] = useState(1);

  const getProblems = async (): Promise<void> => {
    try {
      const url = `Api/Problems/GetAllProblems?page=${page}`;
      console.log(url)
      const { data } = await axios.get(url);
      let newdata: Array<any> = data.problems || [];
      setproblems(newdata);
      console.log(newdata)
      setmaxpage(data.maxpage);
      setelem(data.lastelement);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  const problem =(x:ProblemTrailer, i:number)=>{

        return ( <div
            key={i}
            className={`text-white  ${i % 2 ? 'bg-gray-600' : ''} p-2 flex`}
          >
            <p className='pr-1 pl-1 w-24'>{(lastelem) + i + 1}</p>
            <p className='  w-9/12 hover:text-blue-800 hover:cursor-pointer overflow-hidden'>{x.title}</p>
            <p className={` w-24 ${x.difficulty === "easy" ? 'text-green-900' : 'text-orange-600'} `}>{x.difficulty}</p>
          </div>)
;
  }

  const nextPage = () => {
    if (page < maxpage) {
      setpage(prevstate => prevstate + 1);
    }
  }
  const prevPage = () => {
    if (page > 1) {
      setpage(prevstate => prevstate - 1);
    }
  }

  useEffect(() => {
    getProblems();
  }, [page])

  return (
    <div className='bg-gray-900 h-screen w-full'>
      <div className='flex  p-2'>
        <p className='w-24'>sl no</p>
        <p className='w-9/12'>title</p>
        <p className='w-24'>difficulty</p>
      </div>
      problems.map((x:ProblemTrailer, i:int) => { problem(x, i)})
<div
  className='fixed bottom-4 right-1/2 translate-x-1/2 flex '
>
  <p
    onClick={() => prevPage()}
    className='bg-gray-600 pr-3 pl-3 pt-2 pb-2 rounded-lg cursor-pointer hover:bg-gray-700'
  > {"<"} </p>
  {
    new Array(maxpage).fill(undefined).map((_, i) => (
      i + 1 === page ?
        <p
          key={`${i}th page`}
          className={'bg-gray-600 pr-4 pl-4 pt-2 pb-2 mr-4 ml-4 rounded-lg cursor-pointer'}
        >{i + 1}</p>
        :
        <p
          key={`${i}th page`}
          onClick={() => setpage(i + 1)}
          className={'bg-gray-400 pr-4 pl-4 pt-2 pb-2 mr-4 ml-4 rounded-lg cursor-pointer'}
        >{i + 1}</p>
    ))
  }
  <p
    onClick={() => nextPage()}
    className='bg-gray-600 pr-3 pl-3 pt-2 pb-2  rounded-lg cursor-pointer hover:bg-gray-700'
  >{">"}</p>
</div>
    </div >
  );
}

export default page;
