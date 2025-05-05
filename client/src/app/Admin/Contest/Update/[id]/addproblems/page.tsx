"use client"
import { errorhandler } from "@/app/lib/errorhandler";
import { updateProblem, useContest } from "@/app/lib/slices/contestSlice";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";

const Contest = () => {

  const currentpage = useRef(1);
  const [prob, setprob] = useState<{ _id: string, title: string }[]>([]);
  const [selected, setsel] = useState<string[]>([]);
  const [added, setadded] = useState<string[]>([]);
  const { problems } = useSelector(useContest);
  const dispatch = useDispatch();
  const params = useParams();
  const [max, setmaxpage] = useState(1);
  const [confirm, setconfirm] = useState(false);
  const [loading, setloading] = useState(false);
  const [err, seterr] = useState<string | null>(null);
  const [del, setdel] = useState(false);

  const getCount = async () => {
      const url = `/Api/Problems/TotalProblems?pr=true`;
      const { data } = await axios.get(url);
      if (data.success) {
        let mp = Math.round(data.total / 10);
        if (typeof (mp) !== "number") {
          mp = 1;
        }
        if (mp) {
          setmaxpage(mp)
        } else {
          setmaxpage(1)
        }
      }
  }

  const Getallproblems = async () => {
      if (currentpage.current > max) {
        return;
      }

      const url = `/Api/Problems/GetAllProblems?p=${currentpage.current}&pr=true`;
      const { data } = await axios.get(url);
      if (data.success) {
        const p = [...prob, ...data.Problems];
        setprob(p);
        currentpage.current++;
      }
  }


  useEffect(() => {
    (async () => {
      await errorhandler(getCount);
      await errorhandler(Getallproblems);
    })()

    document.addEventListener("scrollend", Getallproblems);
    return (() => {
      document.removeEventListener("scrollend", Getallproblems);
    })
  }, []);

  const addProblems = async () => {
      setloading(true);
      const url = "/Api/Contests/addProblems";
      const body = {
        problems: selected,
        contestid: params.id
      }
      const { data } = await axios.post(url, body);
      if (data.success) {
        const p = [...problems, ...selected];
        dispatch(updateProblem(p));
        console.log(data)
        setconfirm(false);
        setsel([]);
      }
  }

  const removeProblems = async () => {
      setloading(true);
      const url = "/Api/Contests/removeProblems";
      const body = {
        problems: added,
        contestid: params.id
      }
      const { data } = await axios.post(url, body);
      if (data.success) {
        // const p = [...problems, ];

        const p: string[] = [];
        problems.forEach((i) => {
          if (!added.includes(i)) {
            p.push(i);
          }
        })
        dispatch(updateProblem(p));
        setdel(false);
        setadded([]);
      }
  }


  return (
    <div>
      {
        (selected.length > 0 && added.length === 0) &&
        <>
          <div
            className="flex flex-row-reverse items-center justify-between pl-4 pr-4  m-2"
          >
            <div
              onClick={() => {
                const arr: string[] = [];
                prob.map((p) => {
                  if (!problems.includes(p._id)) {
                    arr.push(p._id);
                  }
                })
                setsel(arr);
              }}
              className="cursor-pointer"
            >select all</div>
            <div
              className="flex flex-row-reverse"
            >
              <div
                onClick={() => setconfirm(true)}
                className="text-green-700 cursor-pointer ml-3"
              >add</div>
              <div
                onClick={() => setsel([])}
                className="cursor-pointer"
              >de-select all</div>
            </div>
          </div>
        </>
      }

{
        (selected.length === 0 && added.length > 0) &&
        <>
          <div
            className="flex flex-row-reverse items-center justify-between pl-4 pr-4  m-2"
          >
            <div
              onClick={() => {
                const arr: string[] = [];
                problems.map((p) => {
                  // if (!problems.includes(p._id)) {
                    arr.push(p);
                  // }
                })
                setadded(arr);
              }}
              className="cursor-pointer"
            >select all</div>
            <div
              className="flex flex-row-reverse"
            >
              <div
                onClick={() => setdel(true)}
                className="text-red-700 cursor-pointer ml-3"
              >remove</div>
              <div
                onClick={() => setadded([])}
                className="cursor-pointer"
              >de-select all</div>
            </div>
          </div>
        </>
      }

      {
        prob.map((x, i) => (
          <>
            {
              problems.find((p) => p === x._id) ?
                added.length > 0 ?
                  <div
                    key={v4()}
                    className={`text-white bg-green-500 p-2 flex m-2`}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      const sel = [...added];
                      let a = added.findIndex((s) => s === x._id);
                      if (typeof (a) === "number") {
                        sel.splice(a, 1);
                      } else {
                        sel.push(x._id);
                      }
                      setadded(sel);
                    }}
                    onClick={(e) => {
                      const sel = [...added];
                      let a = added.findIndex((s) => s === x._id);
                      console.log(a);
                      if (a >= 0) {
                        sel.splice(a, 1);
                      } else {
                        sel.push(x._id);
                      }
                      setadded(sel);
                    }}
                  >
                    <p className='pr-1 pl-1 w-24'>{i + 1}</p>
                    <div
                      className='  w-9/12  overflow-hidden'
                    >
                      {x.title}
                    </div>
                    <input readOnly className=" text-green-500" type="checkbox" checked={added.includes(x._id)} />

                  </div>
                :
                  <div
                    key={v4()}
                    className={`text-white bg-green-500 p-2 flex  m-2`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (selected.length > 0) return;
                      const ad = [...added];
                      ad.push(x._id);
                      console.log(ad)
                      setadded(ad)
                    }}
                  >
                    <p className='pr-1 pl-1 w-24'>{i + 1}</p>
                    <div
                      className='  w-9/12  overflow-hidden'
                    >
                      {x.title}
                    </div>
                    {/* <input readOnly className=" text-green-500" type="checkbox" checked={select.includes(x._id)} /> */}

                  </div>
              :
                <>
                  {
                    selected.length > 0 ?
                      <div
                        key={v4()}
                        className={` m-2 text-white ${i % 2 ? 'bg-gray-600' : ''} p-2 flex`}
                        onContextMenu={(e) => {
                          e.preventDefault()
                          if (added.length > 0) return;
                          console.log(x, problems)
                          const sel = [...selected];
                          let a = selected.findIndex((s) => s === x._id);
                          if (typeof (a) === "number") {
                            sel.splice(a, 1);
                          } else {
                            sel.push(x._id);
                          }
                          setsel(sel);
                        }}
                        onClick={(e) => {
                          console.log(x, problems)
                          if (added.length > 0) return;
                          const sel = [...selected];
                          let a = selected.findIndex((s) => s === x._id);
                          console.log(a);
                          if (a >= 0) {
                            sel.splice(a, 1);
                          } else {
                            sel.push(x._id);
                          }
                          setsel(sel);
                        }}
                      >
                        <p className='pr-1 pl-1 w-24'>{i + 1}</p>
                        <div
                          className='  w-9/12  overflow-hidden'
                        >
                          {x.title}
                        </div>
                        <input readOnly className=" text-green-500" type="checkbox" checked={selected.includes(x._id)} />

                      </div>
                      :
                      <div
                        key={v4()}
                        className={` m-2 text-white ${i % 2 ? 'bg-gray-600' : ''} p-2 flex`}
                        onContextMenu={(e) => {
                          console.log(x, problems)
                          e.preventDefault()
                          if (added.length > 0) return;
                          const sel = [...selected, x._id];
                          setsel(sel);
                        }}
                      >
                        <p className='pr-1 pl-1 w-24'>{i + 1}</p>
                        <div
                          className='  w-9/12  overflow-hidden'
                        >
                          {x.title}
                        </div>
                        {/* <input readOnly className=" text-green-500" type="checkbox" checked={select.includes(x._id)} /> */}

                      </div>
                  }
                </>
            }

          </>
        ))
      }
      {
        confirm &&
        <div
          className="fixed left-0 top-0 w-screen h-screen bg-opacity-50 bg-black flex items-center justify-center"
        >
          <div
            className="bg-zinc-800 rounded-2xl  h-fit p-2 w-fit flex flex-col items-center justify-center"
          >
            {
              selected.length > 0 &&
              <>
                <div
                  className="flex"
                >Do you want to
                  <p
                    className=" text-green-600 pl-1"
                  >
                    add
                  </p>
                  <p
                    className="bg-gray-600 ml-1 mr-1 pl-1 pr-1 rounded-md mb-4"
                  >{
                      `${selected.length} ${selected.length === 1 ? "problem" : "problems"}`
                    }
                  </p>
                  ?
                </div>
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
                    className="m-1 p-1 h-10 w-16 flex items-center justify-center bg-green-700 hover:bg-green-900 rounded-md"
                    onClick={()=>{
                      errorhandler(addProblems);
                      setloading(false);
                    }}
                  >{
                      !loading ?
                        <span>add</span>
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


            }

          </div>

        </div>
      }
      {
        del &&
        <div
          className="fixed left-0 top-0 w-screen h-screen bg-opacity-50 bg-black flex items-center justify-center"
        >
          <div
            className="bg-zinc-800 rounded-2xl  h-fit p-2 w-fit flex flex-col items-center justify-center"
          >
            {
              added.length > 0 &&
              <>
                <div
                  className="flex"
                >Do you want to
                  <p
                    className=" text-red-600 pl-1"
                  >
                    remove
                  </p>
                  <p
                    className="bg-gray-600 ml-1 mr-1 pl-1 pr-1 rounded-md mb-4"
                  >{
                      `${added.length} ${added.length === 1 ? "problem" : "problems"}`
                    }
                  </p>
                  ?
                </div>
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
                    onClick={()=>{
                      errorhandler(removeProblems);
                      setloading(false);
                    }}
                  >{
                      !loading ?
                        <span>remove</span>
                        :
                        <AiOutlineLoading3Quarters className=" animate-spin" />
                    }</button>
                  <button
                    className="m-1 p-1 h-10 w-16 bg-gray-700 hover:bg-gray-900 rounded-md"
                    onClick={() => {
                      setdel(false);
                    }}
                  >cancel</button>
                </div>
              </>


            }

          </div>

        </div>
      }
    </div>
  )
}

export default Contest;