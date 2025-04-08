import { Problem } from "@/app/lib/api/problemModel";
import { v4 } from "uuid";


interface body{
    Problem:Problem,
}

const ProblemDescription : React.FC<body> =({Problem})=>{
    return(
        <>
        {
            Problem && 
            <div className=" h-full  p-4 flex flex-col no-scrollbar overflow-scroll"
       
      >
        <div
          className="flex align-middle justify-between"
        >
          <p
            className={` w-24 font-medium ${Problem.difficulty === "Easy" ? 'text-green-900' : Problem.difficulty === "Medium" ? 'text-orange-600' : "text-red-600"} `}

          >{Problem.difficulty}</p>
          <div
            className="text-gray-500"
          >
            {
              Problem.tags.map((elem) => (
                <span

                  key={v4()}
                  className="ml-4"
                >{elem}</span>
              ))
            }
          </div>
        </div>
        <h2
          className="text-xl font-bold m-5"
        >{Problem.title}</h2>
        <p>{Problem.description}</p>

        <div
          className="text-gray-400 border-gray-800 border-2 p-3 rounded-md mt-3"
        >
          {
            Problem.testcases.map(({ input, output }) => (
              <div
              key={v4()}
              >
                <pre>input : {input}</pre>
                <p>output : {output}</p>
              </div>
            ))
          }
        </div>



      </div>
        }
        </>
        
    )
}

export default ProblemDescription;