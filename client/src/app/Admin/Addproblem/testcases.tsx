import { Dispatch, SetStateAction, useRef } from "react";
import { v4 } from "uuid";
import { FaCheck } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

interface obj {
    input:string
    output:string
}

interface testcasestype {
    testcases: obj[]
    settestcases: Dispatch<SetStateAction<obj[]>>
}

const Testcases: React.FC<testcasestype> = ({ testcases, settestcases }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const outputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div
            className="p-3 m-3 select-none "
        >
            <div
                className="text-white"
            >testcases</div>
            <div
                className="flex items-center"
            >
                <div className="flex flex-col w-fit">
                <input
                    className="mt-3 p-1 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="input"
                    type="text"
                    maxLength={1000}
                    ref={inputRef}
                />
                <input
                    className="mt-3 p-1 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="output"
                    type="text"
                    maxLength={1000}
                    ref={outputRef}
                />
                </div>
               
                <FaCheck
                    onClick={() => {
                        if (inputRef.current && outputRef.current) {
                            const input = inputRef.current;
                            const output = outputRef.current;
                            if (input.value.length >= 1 && output.value.length >=1 && testcases.length<10) {
                                const alltestcases = [...testcases];
                                alltestcases.push({input:input.value,output:output?.value});
                                settestcases(alltestcases);
                                input.value = ""
                                output.value = ""
                            }
                        }
                    }}
                    className="cursor-pointer m-1 mt-3 border-white border text-white rounded-full w-5 h-5 p-1 bg-green-600"
                />
            </div>

            <div
            className="flex flex-col"
            >
                {
                    testcases.map((tag,i) => (
                        <div
                        className="flex items-center"
                        id={v4()}
                        >
                        <div>
                        <p
                            className="flex items-center justify-center bg-stone-900 pt-1 pb-1 p-2 m-2 text-white w-fit"
                        >{tag.input}
                        
                        </p>
                        <p
                            className="flex items-center justify-center bg-stone-900 pt-1 pb-1 p-2 m-2 text-white w-fit"
                        >{tag.output}
                        
                        </p>
                        </div>
                        <RxCrossCircled 
                        className="ml-2 text-red-500 cursor-pointer" 
                        onClick={()=>{
                            let newtestcases :obj[] = []
                            testcases.map((t,j)=>{
                                if(i != j){
                                    newtestcases.push(t);
                                }
                            })
                            console.log(newtestcases)
                            settestcases(newtestcases);
                        }}
                        />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Testcases;