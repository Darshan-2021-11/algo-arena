"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "@/app/lib/errorhandler";
import { useParams } from "next/navigation";
import ProblemDescription from "./Problem";
import { Problem } from "@/app/lib/api/problemModel";

interface resulttype {
  status: {
    id: number | null;
    description: string | null;
  };
  time: string;
  memory: string;
  errmsg?: string;
}

interface sizetype {
  width: number;
  height?: number;
  w: number;
}

interface msgtype {
  message: string;
  _id: string;
  replies?: msgtype[];
  user: string;
}

interface pagetype {
  altproblem?: Problem;
  contesturl?: string;
}

const IDE: React.FC<pagetype> = ({ altproblem, contesturl }) => {

  const [Problem, setProblem] = useState<Problem>();
  const [result, setresult] = useState<resulttype[]>([]);
  const tokens = useRef<string[]>([]);
  const idref = useRef(null) as React.MutableRefObject<NodeJS.Timeout | null>;
  const [coderun, setcoderun] = useState(false);
  const problemId = useRef(null) as React.MutableRefObject<string | null>;
  const [Comment, setComment] = useState<msgtype[]>([]);
  const [p, setp] = useState("a");
  const { id } = useParams();

  // size control
  const [size, setsize] = useState<sizetype>({
    width: 0,
    height: 0,
    w: window.innerWidth,
  });
  const [move, setmove] = useState(false);

  useEffect(() => {
    const newsize = {
      width: window.innerWidth / 2,
      w: window.innerWidth,
    };
    setsize(newsize);
  }, []);

  useEffect(() => {
    const handlemove = (e: MouseEvent) => {
      const s = { ...size };
      s.width += e.movementX;
      setsize(s);
    };

    const handleleave = () => {
      setmove(false);
    };

    const handleresize = () => {
      const p = (size.width / size.w) * 100;
      const newsize = window.innerWidth * (p / 100);
      setsize({ width: newsize, w: window.innerWidth });
    };

    if (move) {
      window.addEventListener("mousemove", handlemove);
      window.addEventListener("mouseleave", handleleave);
      window.addEventListener("mouseup", handleleave);

      return () => {
        window.removeEventListener("mousemove", handlemove);
        window.removeEventListener("mouseleave", handleleave);
        window.removeEventListener("mouseup", handleleave);
      };
    }
    window.addEventListener("resize", handleresize);
    return () => {
      window.removeEventListener("resize", handleresize);
    };
  }, [move, size]);
  //


  const failed_test: resulttype[] = [
    { status: { id: null, description: null }, time: "0.000", memory: "N/A " },
  ];

  const getResult = async () => {
    if (tokens.current.length == 0) {
      if (idref.current) {
        clearInterval(idref.current);
        setcoderun(false);
      }
    }
    const updatedTokens: string[] = [];
    for (let i = 0; i < tokens.current.length; i++) {
      try {
        const submissionurl = `http://localhost:2358/submissions/${tokens.current[i]}?base64_encoded=false&wait=false`;
        const data = await axios.get(submissionurl);
        if (data.status === 200 && data.data.status.id !== 1 && data.data.status.id !== 2 && problemId.current) {
          const storeResultUrl = `/Api/Problems/StoreResult?pid=${problemId.current}&msg=${data.data.status.description}`;
          const d = await axios.get(storeResultUrl);
          const res = {
            status: {
              description: data.data.status.description,
              id: data.data.status.id,
            },
            time: data.data.time,
            memory: data.data.memory,
            errmsg: data.data.stderr,
          };
          if (d.data.success) {
            const results = [...result];
            let newrs = [];
            newrs = results.map((t: any) => {
              if (typeof t === "string") {
                t = res;
              }
              return t;
            });
            setresult(newrs);
          } else {
            res.status.id = 11;
            res.status.id = "unable to get result";
          }
        } else {
          updatedTokens.push(tokens.current[i]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    tokens.current = updatedTokens;
  };

  useEffect(() => {
    if (coderun) {
      const id = setInterval(() => {
        getResult();
      }, 3000);
      idref.current = id;
    }
  }, [coderun]);

  const getProblem = async (): Promise<void> => {
    try {
      if (id && !altproblem) {
        const url = `/Api/Problems/GetProblembyId?id=${id}`;
        const { data } = await axios.get(url);
        setProblem(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProblem();
  }, []);

  useEffect(() => {
    if (altproblem) {
      setProblem(altproblem);
    }
  }, [altproblem]);

  return (
    // <div
    //   className={`${move && "cursor-col-resize"
    //     } transition-all duration-100 overflow-hidden`}
    // >
    //   {Problem ? (
    //     <>
    //       <div
    //         className="flex h-full w-full overflow-hidden"
    //         style={{
    //           maxHeight: "100vh",
    //         }}
    //       >
    //         <div
    //           className="border h-full w-full overflow-hidden border-zinc-600 rounded-xl m-1 bg-zinc-900"
    //           style={{
    //             height:"calc( 100vh - 72px )"
    //           }}
    //         >
    //           <div className="flex p-3 overflow-hidden">
    //             <p
    //               className="mr-4 bg-black pt-1 pb-1 pl-2 pr-2 rounded-xl cursor-pointer text-gray-50 hover:text-gray-300"
    //               onClick={() => setp("a")}
    //             >
    //               description
    //             </p>
    //             {
    //               !altproblem &&
    //               <p
    //                 className="mr-4 bg-black pt-1 pb-1 pl-2 pr-2 rounded-xl cursor-pointer text-gray-50 hover:text-gray-300"
    //                 onClick={() => setp("b")}
    //               >
    //                 discussion
    //               </p>
    //             }
    //             {/* <p
    //               className='mr-4 bg-black pt-1 pb-1 pl-2 pr-2 rounded-xl cursor-pointer text-gray-50 hover:text-gray-300'
    //               >submissions</p> */}
    //           </div>
    //           {p === "a" && <ProblemDescription Problem={Problem} />}
    //           {p === "b" && !altproblem && (
    //             <Commentpage comments={Comment} setcomments={setComment} id={id} />
    //           )}
    //         </div>



    //       </div>

    //     </>
    //   ) : (
    //     <div>Invalid page </div>
    //   )}
    // </div>
    Problem && <ProblemDescription Problem={Problem} />
  );
};

export default IDE;
