"use client"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Link from "next/link";
import { v4 } from "uuid";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Problems = () => {

  const [page, setpage] = useState(1);
  const [problems, setproblems] = useState<{ title: string, _id: string }[]>([]);
  const [maxpage, setmaxpage] = useState(1);
  const [lastelem, setelem] = useState(0);
  const [select, setselect] = useState<string[]>([]);
  const [confirm, setconfirm] = useState(false);
  const selectedref = useRef("");
  const selectedidref = useRef("");
  const [loading, setloading] = useState(false);
  const [err, seterr] = useState<string | null>(null);


  const getProblems = async (): Promise<void> => {
    try {
      const url = `/Api/Problems/GetAllProblems?page=${page}`;
      const { data } = await axios.get(url);
      let newdata: Array<{ title: string, _id: string }> = data.Problems || [];
      setproblems(newdata);
      setmaxpage(data.maxpage);
      setelem(lastelem + ((page - 1) * newdata.length))
    } catch (err) {
      console.log(err);
    }
  }

  const deleteProblem = async (): Promise<void> => {
    try {
      setloading(true);
      const url = `/Api/Problems/DeleteProblembyId?p=${selectedidref.current}`;
      const { data } = await axios.delete(url);
      if (data.success) {
        getProblems();
        setconfirm(false);
      }
    } catch (err: any) {
      seterr(err.message)
      console.log(err);
    } finally {
      setloading(false);
    }
  }

  const deleteProblems = async () => {
    try {
      setloading(true);
      const url = `/Api/Problems/DeleteProblems`;
      const body = { ids: select }
      const { data } = await axios.post(url, body);
      if (data.success) {
        getProblems();
        setconfirm(false);
        setselect([])
      }
    } catch (err: any) {
      console.log(err);
      seterr(err.message);
    } finally {
      setloading(false);
    }
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

  const handleclick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const temparr = [...select];
    const index = temparr.findIndex((t) => t === id);
    const found = temparr.includes(id)
    if (found && typeof (index) === "number") {
      temparr.splice(index, 1);
    } else {
      temparr.push(id);
    }
    setselect(temparr);
  }


  return (
    <>
      <div className='bg-gray-900 h-full w-full'>
        <div className='flex  p-2'>
          <p className='w-24'>sl no</p>
          <p className='w-9/12'>title</p>
          <p className='w-24'>options</p>
        </div>
        {
          select.length > 0 ?
            <>
              <div
                className="flex flex-row-reverse items-center justify-between pl-4 pr-4"
              >
                <div
                  onClick={() => {
                    const arr: string[] = [];
                    problems.map((p) => {
                      arr.push(p._id);
                    })
                    setselect(arr);
                  }}
                  className="cursor-pointer"
                >select all</div>
                <div
                  className="flex flex-row-reverse"
                >
                  <div
                    onClick={() => setconfirm(true)}
                    className="text-red-700 cursor-pointer ml-3"
                  >delete</div>
                  <div
                    onClick={() => setselect([])}
                    className="cursor-pointer"
                  >de-select all</div>
                </div>
              </div>

              {
                problems.map((x, i) => (
                  <div
                    key={v4()}
                    className={`text-white  ${i % 2 ? 'bg-gray-600' : ''} p-2 flex`}
                    onClick={(e) => {
                      handleclick(e, x._id);
                    }}
                    onContextMenu={(e) => {
                      handleclick(e, x._id);
                    }}
                  >
                    <p className='pr-1 pl-1 w-24'>{lastelem + i + 1}</p>
                    <div
                      className='  w-9/12  overflow-hidden'
                    >
                      {x.title}
                    </div>
                    <input readOnly className=" text-green-500" type="checkbox" checked={select.includes(x._id)} />

                  </div>
                ))
              }
            </>
            :
            problems.map((x, i) => (
              <div
                key={v4()}
                className={`text-white  ${i % 2 ? 'bg-gray-600' : ''} p-2 flex`}
                onContextMenu={(e) => {
                  handleclick(e, x._id);
                }}
              >
                <p className='pr-1 pl-1 w-24'>{lastelem + i + 1}</p>
                <div
                  className='  w-9/12  overflow-hidden'
                >
                  {x.title}
                </div>
                <Link
                  className="hover:bg-green-600 rounded-md cursor-pointer mr-2  p-1"
                  href={`/Admin/Problems/${x._id}`}
                >
                  <MdEdit className=" text-white  " />
                </Link>

                <MdDelete
                  onClick={() => {
                    selectedref.current = x.title;
                    selectedidref.current = x._id;
                    setconfirm(true);
                  }}
                  className=" text-red-600 hover:text-white hover:bg-red-600 rounded-md p-1 text-2xl cursor-pointer" />

              </div>
            ))
        }
        {
          problems.length === 0 &&
          <div className="text-white flex items-center justify-center">No problems found.</div>
        }
        <div
          className='fixed bottom-4 right-1/2 translate-x-1/2 flex '
        >
          <p
            onClick={() => prevPage()}
            className='bg-gray-600 pr-3 pl-3 pt-2 pb-2 rounded-lg cursor-pointer hover:bg-gray-700'
          > Prev </p>
          {
            new Array(maxpage).fill(undefined).map((_, i) => (
              i + 1 === page ?
                <p
                  key={`${v4()}th page`}
                  className={'bg-gray-600 pr-4 pl-4 pt-2 pb-2 mr-4 ml-4 rounded-lg cursor-pointer'}
                >{i + 1}</p>
                :
                <p
                  key={`${v4()}th page`}
                  onClick={() => setpage(i + 1)}
                  className={'bg-gray-400 pr-4 pl-4 pt-2 pb-2 mr-4 ml-4 rounded-lg cursor-pointer'}
                >{i + 1}</p>
            ))
          }
          <p
            onClick={() => nextPage()}
            className='bg-gray-600 pr-3 pl-3 pt-2 pb-2  rounded-lg cursor-pointer hover:bg-gray-700'
          >Next</p>
        </div>
      </div >
      {
        confirm &&
        <div
          className="fixed left-0 top-0 w-screen h-screen bg-opacity-50 bg-black flex items-center justify-center"
        >
          <div
            className="bg-zinc-800 rounded-2xl  h-1/3 w-1/2 flex flex-col items-center justify-center"
          >
            {
              select.length > 0 ?
                <>
                  <p
                    className="flex"
                  >Do you want to
                    <p
                      className=" text-red-600 pl-1"
                    >
                      delete
                    </p>
                    <p
                      className="bg-gray-600 ml-1 mr-1 pl-1 pr-1 rounded-md mb-4"
                    >{
                        `${select.length} problems`
                      }
                    </p>
                    ?
                  </p>
                  {
                    err ?
                      <p
                        className="h-6 w-5"
                      ></p>
                      :
                      <p
                        className="h-6 w-5 text-red-600"
                      >{err}</p>
                  }
                  <div className="flex">
                    <button
                      className="m-1 p-1 h-10 w-16 flex items-center justify-center bg-red-700 hover:bg-red-900 rounded-md"
                      onClick={deleteProblems}
                    >{
                        !loading ?
                          <span>delete</span>
                          :
                          <AiOutlineLoading3Quarters className=" animate-spin" />
                      }</button>
                    <button
                      className="m-1 p-1 h-10 w-16 bg-gray-700 hover:bg-gray-900 rounded-md"
                      onClick={() => {
                        setconfirm(false);
                      }}
                    >cancel</button>
                  </div>
                </>
                :
                <>
                  <p
                    className="flex"
                  >Do you want to
                    <p
                      className=" text-red-600 pl-1"
                    >
                      delete
                    </p>
                    <p
                      className="bg-gray-600 ml-1 mr-1 pl-1 pr-1 rounded-md mb-4"
                    >
                      {
                        select.length > 0 ?
                          `${select.length} problems`
                          :
                          selectedref.current
                      }
                    </p>
                    ?
                  </p>
                  {
                    err ?
                      <p
                        className="h-6 w-5"
                      ></p>
                      :
                      <p
                        className="h-6 w-5 text-red-600"
                      >{err}</p>
                  }
                  <div className="flex">
                    <button
                      className="m-1 p-1 h-10 w-16 flex items-center justify-center bg-red-700 hover:bg-red-900 rounded-md"
                      onClick={deleteProblem}
                    >
                      {
                        !loading ?
                          <span>delete</span>
                          :
                          <AiOutlineLoading3Quarters className=" animate-spin" />
                      }

                    </button>
                    <button
                      className="m-1 p-1 h-10 w-16 bg-gray-700 hover:bg-gray-900 rounded-md"
                      onClick={() => {
                        setloading(false)
                        setconfirm(false);
                        selectedref.current = "";
                      }}
                    >cancel</button>
                  </div>
                </>

            }

          </div>

        </div>
      }
    </>
  )
}

export default Problems