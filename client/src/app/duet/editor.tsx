import { useEffect, useState } from "react";
import CodeEditor from "../utils/Editor";
import { v4 } from "uuid";
import { useSocket } from "../lib/contexts/socketContext";


interface sizetype {
  width: number
  height?: number
  w: number
}


const Codeeditor = () => {
  const { Problem, matchStart, surrenderMatch, submitMatch, lang, setlang, code, setcode } = useSocket();
  const [size, setsize] = useState<sizetype>({ width: 0, height: 0, w: window.innerWidth });
  const [move, setmove] = useState(false);

  useEffect(() => {
    const newsize = {
      width: window.innerWidth / 2,
      w: window.innerWidth
    }
    setsize(newsize);
  }, [])


  useEffect(() => {

    const handlemove = (e: MouseEvent) => {
      const s = { ...size };
      s.width += e.movementX;
      setsize(s);
    }

    const handleleave = () => {
      setmove(false);
    }

    const handleresize = () => {
      const p = size.width / size.w * 100;
      const newsize = window.innerWidth * (p / 100);
      setsize({ width: newsize, w: window.innerWidth })
    }

    if (move) {

      window.addEventListener("mousemove", handlemove);
      window.addEventListener("mouseleave", handleleave)
      window.addEventListener("mouseup", handleleave)

      return (() => {
        window.removeEventListener("mousemove", handlemove);
        window.removeEventListener("mouseleave", handleleave)
        window.removeEventListener("mouseup", handleleave)


      })
    }
    window.addEventListener("resize", handleresize);
    return (() => {
      window.removeEventListener("resize", handleresize);
    })
  }, [move, size])

  console.log(Problem)
  return (
    <>
      {
        matchStart &&
        <div
          className={`${move && "cursor-col-resize"} w-screen bg-black z-40 top-0 left-0`}
          style={{
            height: "calc( 100vh - 64px )"
          }}
        >


          {
            Problem ?
              <>
                <div className="flex h-full w-full overflow-hidden"
                  style={{
                    maxHeight: '100vh'
                  }}
                >
                  {
                    Problem ?
                      <div className=" border  border-zinc-600 rounded-xl m-1 bg-zinc-900 p-4 flex flex-col no-scrollbar overflow-scroll"
                        style={{
                          width: size.width,
                          maxHeight: "85vh"

                        }}
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

                        <button
                          className=" bg-red-600 absolute left-0 bottom-0 m-23 w-fit m-3 pt-2 pb-2 pl-3 pr-3 outline-none rounded-lg"
                          onClick={surrenderMatch}
                        >
                          surrender
                        </button>
                      </div>
                      :
                      //loading screen
                      <div className="w-1/2 p-4 border-r flex flex-col ">
                        <h2 className="text-xl font-bold"></h2>
                        <p></p>
                      </div>

                  }
                  <div
                    onMouseDown={() => setmove(true)}
                    className={` relative ${move && "bg-blue-500"}  w-1 cursor-col-resize bg-transparent hover:bg-blue-500 rounded-lg  mr-2 ml-2`}
                    style={{
                      height: '80vh'
                    }}
                  ></div>


                  <div className=" p-4 flex flex-col border border-zinc-600 rounded-xl bg-zinc-900 overflow-hidden"
                    style={{ width: innerWidth - size.width }}
                  >
                   

                    <form className="flex-1 flex flex-col ">

                      <CodeEditor setValue={setcode} value={code} setlang={setlang} lang={lang} />


                      <div className="flex justify-between pt-2">
                        <div className="flex items-center space-x-5"></div>
                        <div className="flex-shrink-0">
                          <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            onClick={(e) => {
                              e.preventDefault();
                              // runcode();
                              submitMatch();
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>


              </>
              :
              <div>Invalid page </div>
          }


        </div>
      }

    </>
  )
}

export default Codeeditor;