"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { contestproblemmodel } from "@/app/lib/api/contestModel";
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "next/navigation";
import IDE from "@/app/Problems/[id]/page";
import { Problem } from "@/app/lib/api/problemModel";


const Page = () => {

    const [problems, setProblems] = useState<Array<contestproblemmodel>>([]);
    const [currproblem, setcurrproblem] = useState<number|null>(null)
      const { id } = useParams();
    
      useEffect(() => {
        const fetchContests = async () => {
          try {
            
            const url = `GetContest?_id=${id}`;
            console.log(url)
            const response = await axios.get(url);
    
            if (response.data?.success) {
              // console.log(response.data.Problem.problems);
              const probs = response.data.Problem.problems;
              setProblems(probs);
              if(probs.length > 0){
                setcurrproblem(0)
              }
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

    return(<>
      
      <div className='bg-gray-900 h-full w-full'>
            <div
            className="flex"
            >
              <div>

            {
              problems.map((x,i)=>(
                <div
                  key={uuidv4()}
                  onClick={()=>{
                    setcurrproblem(i);
                  }}
                  className={`${i == currproblem ? "text-green-500 bg-gray-600" : "text-white"} p-2 flex`}
                > 
                  <p 
                  className='pr-1 pl-1 h-8 whitespace-nowrap text-center'                 
                  >{x.alias ? x.alias : `problem ${i+1}`}</p>
                  
                </div>
              ))
            }
              </div>

            {
              currproblem !== null &&
              <IDE altproblem={problems[currproblem]} contesturl={`Contest`}/>
            }
            </div>

      
          </div >

    </>)

};

export default Page;