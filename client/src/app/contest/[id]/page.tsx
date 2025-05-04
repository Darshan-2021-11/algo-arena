"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { contestproblemmodel } from "@/app/lib/api/contestModel";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "next/navigation";
import { TfiMenuAlt } from "react-icons/tfi";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setContestid } from "@/app/lib/slices/contestSlice";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "@/app/lib/slices/authSlice";


const Page = () => {

  const [problems, setProblems] = useState<Array<contestproblemmodel>>([]);
  const [reg, setreg] = useState(false);
  const [des, setdes] = useState<{ name: string, description: string, endTime: string, startTime: string } | null>(null);
  const [load, setload] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector(useAuth); 

  const currentTime = new Date();

  useEffect(() => {
    const fetchContests = async () => {
      try {

        const url = `/Api/Contests/GetContest?id=${id}`;
        const response = await axios.get(url);

        if (response.data?.success) {
          const body = response.data.body;
          console.log(body)
          const probs = body.problems;
          setProblems(probs);
          if (body.registerd) {
            setreg(true);
          }
          const des = {
            name: body.name,
            description: body.description,
            endTime: body.endTime,
            startTime: body.startTime
          }
          setdes(des);
        } else {
          console.error("Failed to fetch contests:", response.data?.message);
        }
      } catch (error: any) {
        console.error(
          "Error fetching contests:",
          error.response?.data || error.message
        );
      }
    };

    fetchContests();

  }, []);

  const register = async () => {
    try {
      setload(true);
      const url = "/Api/Contests/register";
      const { data } = await axios.post(url, { id, user:auth.id });
      if (data.success) {
        setreg(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setload(false);
    }
  }

  return (<div >
    {
      des &&
      <>
        <Link
          href={"/contest"}
          className="rounded-full bg-gray-600 w-7 h-7"
        >
          <MdArrowBackIosNew className="rounded-full bg-gray-600 p-2 m-2 box-content" />
        </Link>
        <div>
          <h1 className=" text-5xl m-3 font-semibold font-mono text-orange-100">{des.name}</h1>
          <div className=" flex">
            <span className="m-3 ml-5 text-lg font-mono">{new Date(des.startTime).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <div
              className="flex items-center justify-center"
            >

              {
                new Date(des.startTime) < currentTime
                  ?
                  new Date(des.endTime) < currentTime
                    ?
                    <> <div className="h-3 w-3 rounded-full bg-gray-600 ml-3 mr-2"></div> End</>
                    :
                    <> <div className="h-3 w-3 rounded-full bg-green-600 ml-3 mr-2"></div> Ongoing</>
                  :
                  <><div className="h-3 w-3 rounded-full bg-gray-600 ml-3 mr-2"></div> Upcoming</>
              }</div>
          </div>
        </div>

        {
          ((new Date(des.startTime) < currentTime || new Date(des.startTime) >= currentTime) && new Date(des.endTime) > currentTime) &&
          (
            reg ?
              <button className="ml-5 bg-gray-700 p-4 pt-2 pb-2 rounded-2xl hover:bg-gray-800  w-32 h-10">Registered</button>
              :
              load ?
                <button onClick={register} className="ml-5 bg-gray-700 p-4 pt-2 pb-2 rounded-2xl hover:bg-gray-800 w-32 h-10 flex items-center justify-center"><AiOutlineLoading3Quarters className="animate-spin" /></button>
                :
                <button onClick={register} className="ml-5 bg-gray-700 p-4 pt-2 pb-2 rounded-2xl hover:bg-gray-800 w-32 h-10">Register</button>

          )
        }


        {
          (new Date(des.startTime) <= currentTime && new Date(des.endTime) > currentTime) &&
          <div
          className="flex items-center justify-start m-5"
          >
          <div className=" text-lg text-gray-400 mr-4">Contest will end at</div>
          <div className=" text-lg font-mono"> {new Date(des.endTime).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        }
        <div></div>

        <div className="flex justify-between">
          <div
            className="ml-6"
          >
            {des.description}
          </div>
          <div
            className=" m-4"
          >
            {
              problems.length > 0 &&
              <>
                <div
                  className="bg-zinc-700 pt-3 pb-3 pl-4 pr-4 rounded-t-xl flex items-center justify-center"
                ><TfiMenuAlt className="mr-2" /> Problems List</div>
                {
                  problems.map((x, i) => (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(setContestid(id))
                        router.push(`/Problems/${x}`);
                      }}
                      key={uuidv4()}
                      className="bg-zinc-700 bg-opacity-40 pr-1 pl-4 pt-2 pb-1 flex items-center justify-start cursor-pointer hover:bg-zinc-600 m-1 rounded-xl"
                    >
                      <p
                        className=' h-8 whitespace-nowrap '
                      >{x.alias ? x.alias : `problem ${i + 1}`}</p>

                    </div>
                  ))
                }
              </>
            }
          </div>
        </div>

      </>
    }


  </div>)

};

export default Page;