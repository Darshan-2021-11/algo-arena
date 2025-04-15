'use client'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link';
import { Problem } from '../lib/api/problemModel';
import { v4 } from 'uuid';

const Page = () => {

  const [page, setpage] = useState(1);
  const [problems, setproblems] = useState<Problem[]>([]);
  const [maxpage, setmaxpage] = useState(1);
    const pagesize = 10;
    const lastelem = useRef(0);
    const [pages, setpages] = useState<number[]>([1]);
  

  const getProblems = async (): Promise<void> => {
    try {
      const url = `Api/Problems/GetAllProblems?page=${page}`;
      const { data } = await axios.get(url);
      let newdata: Array<any> = data.Problems || [];
      setproblems(newdata);
    } catch (err) {
      console.log(err);
    }
  }

  const getCount = async () => {
    try {
      const url = `/Api/Problems/TotalProblems`;
      const { data } = await axios.get(url);
      if (data.success) {
        let mp = Math.round(data.total / pagesize);
        if (typeof (mp) !== "number") {
          mp = 1;
        }
        console.log(mp)
        setmaxpage(mp)
      }
    } catch (err: any) {
      console.log(err);
    }
  }


  const nextPage = () => {
    if (page < maxpage) {
      lastelem.current += pagesize;
      setpage(prevstate => prevstate + 1);
    }
  }
  const prevPage = () => {
    if (page > 1) {
      lastelem.current -= pagesize;
      setpage(prevstate => prevstate - 1);
    }
  }

  useEffect(() => {
    getProblems();
    let a = 1;
    if (maxpage - page >= 2) {
      a = page >= 2 ? page - 2 : 0;
    } else {
      a = maxpage > 4 ? maxpage - 4 : 0;
    }
    console.log(maxpage,a)

    const p = [];
    for (let i = a; i < a + 4 && i < maxpage; i++) {
      p.push(i);
    }
    setpages(p);
  }, [page])

  // console.log(maxpage)

  useEffect(() => {
    const p = [];
    for (let i = 0; i < 4; i++) {
      if ((i + 1) > maxpage) {
        break;
      }
      p.push(i);
    }
    setpages(p);
  }, [maxpage])

  useEffect(()=>{
    (async()=>{
      await getCount()
    })()
  },[])

  return (
    <div className='bg-gray-900 h-full w-full'>
      <div className='flex  p-2'>
        <p className='w-24'>sl no</p>
        <p className='w-9/12'>title</p>
        <p className='w-24'>difficulty</p>
      </div>
      {
        problems.map((x,i)=>(
          <div
            key={v4()}
            className={`text-white  ${i % 2 ? 'bg-gray-600' : ''} p-2 flex`}
          >
            <p className='pr-1 pl-1 w-24'>{lastelem.current+i+1 }</p>
          <Link 
          href={`/Problems/${x._id}`}
          className='  w-9/12 hover:text-blue-800 hover:cursor-pointer overflow-hidden'
          >
            {x.title}
            </Link>
            <p 
            className={` w-24 font-medium ${x.difficulty === "Easy" ? 'text-green-900' : x.difficulty === "Medium" ? 'text-orange-600' : "text-red-600"} `}
            >{x.difficulty}</p>
          </div>
        ))
      }
<div
          className='fixed bottom-4 right-1/2 translate-x-1/2 flex  bg-gray-900 rounded-2xl'
        >
          <div
          className="flex "
          >
            <p
              onClick={() => prevPage()}
              className=' p-1 m-2 rounded-lg cursor-pointer hover:bg-gray-700'
            > Prev </p>

            {
              pages.map((i) => (
                i + 1 === page ?
                  <p
                    key={`${v4()}th page`}
                    className={' p-1 m-2  rounded-full hover:bg-gray-700 cursor-pointer'}
                  >{i + 1}</p>
                  :
                  <p
                    key={`${v4()}th page`}
                    onClick={() => {
                      
                      if (i + 1 < page) {
                        prevPage();
                      } else {
                        nextPage();
                      }
                    }}
                    className={'p-1 m-2 rounded-full text-gray-500 hover:bg-gray-700 cursor-pointer'}
                  >{i + 1}</p>
              ))
            }

            <p
              onClick={() => nextPage()}
              className='p-1 m-2  rounded-lg cursor-pointer hover:bg-gray-700'
            >Next</p>
          </div>

          <div
          className="flex items-center justify-center ml-3"
          >
            <span
            className=" whitespace-nowrap break-keep"
            >go to page</span>
            <input 
            min={1}
            defaultValue={1}
            max={maxpage}
            onKeyDown={(e)=>{
              if(e.code === "Enter"){
                const p = Number(e.currentTarget.value);
                if(p > maxpage){
                  return;
                }
                if(p < 0){
                  return;
                }
                lastelem.current = (p-1) * pagesize;
                setpage(p)
              }
            }}
            type="number" 
            className="w-12 mr-3 rounded-xl ml-3 pl-2 bg-transparent border-white outline-none border-2 text-white" />
          </div>
        </div>
    </div >
  );
}

export default Page;
