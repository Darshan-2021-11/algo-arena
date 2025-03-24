import { Dispatch, SetStateAction, useRef } from "react";
import { v4 } from "uuid";
import { FaCheck } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";



interface constraintstype {
    constraints: string[]
    setconstraints: Dispatch<SetStateAction<string[]>>
}

const Constraints: React.FC<constraintstype> = ({ constraints, setconstraints }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    return (
        <div
            className="p-3 m-3 select-none "
        >
            <div
                className="text-white"
            >constraints</div>
            <div
                className="flex items-center "
            >
                <input
                    className="mt-3 p-1 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="constraint"
                    type="text"
                    maxLength={25}
                    ref={inputRef}
                />
                <FaCheck
                    onClick={() => {
                        if (inputRef.current) {
                            const input = inputRef.current;
                            if (input.value.length >= 1 && constraints.length<10) {
                                const allconstraints = [...constraints];
                                allconstraints.push(input.value);
                                setconstraints(allconstraints);
                                input.value = ""
                            }
                        }
                    }}
                    className="cursor-pointer m-1 mt-3 border-white border text-white rounded-full w-5 h-5 p-1 bg-green-600"
                />
            </div>

            <div
            className="flex flex-col flex-wrap max-h-60"
            >
                {
                    constraints.map((tag,i) => (
                        <p
                            className="flex items-center justify-center bg-stone-900 pt-1 pb-1 p-2 m-2 text-white w-fit"
                            id={v4()}
                        >{tag}
                        <RxCrossCircled 
                        className="ml-2 text-red-500 cursor-pointer" 
                        onClick={()=>{
                            let newconstraints :string[] = []
                            constraints.map((t,j)=>{
                                if(i!== j){
                                    newconstraints.push(t);
                                }
                            })
                            console.log(newconstraints)
                            setconstraints(newconstraints);
                        }}
                        />
                        </p>
                    ))
                }
            </div>
        </div>
    )
}

export default Constraints;