import { Dispatch, SetStateAction, useRef } from "react";
import { v4 } from "uuid";
import { FaCheck } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";


interface tagstype {
    tags: string[]
    settags: Dispatch<SetStateAction<string[]>>
}

const Tags: React.FC<tagstype> = ({ tags, settags }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    return (
        <div
            id="tags"
            className="p-3 m-3 select-none "
        >
            <div
                className="text-white"
            >tags</div>
            <div
                className="flex items-center "
            >
                <input
                    className="mt-3 p-1 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    placeholder="tag"
                    type="text"
                    maxLength={15}
                    ref={inputRef}
                />
                <FaCheck
                    onClick={() => {
                        if (inputRef.current) {
                            const input = inputRef.current;
                            if (input.value.length >= 1 && tags.length < 10 && !tags.find((c)=>c === input.value)) {
                                const alltags = [...tags];
                                alltags.push(input.value);
                                settags(alltags);
                                input.value = ""
                            }
                        }
                    }}
                    className="cursor-pointer m-1 mt-3 border-white border text-white rounded-full w-5 h-5 p-1 bg-green-600"
                />
            </div>

            <div
                className="flex flex-wrap "
                id="tagvalue"
            >
                {
                    tags.map((tag, i) => (
                        <div
                            className="flex items-center justify-center bg-stone-900 pt-1 pb-1 p-2 m-2 text-white w-fit"
                            key={v4()}
                        >
                            <p>
                            {tag}
                            </p>
                            <RxCrossCircled
                                className="ml-2 text-red-500 cursor-pointer"
                                onClick={() => {
                                    let newtags: string[] = []
                                    tags.map((t, j) => {
                                        if (i !== j) {
                                            newtags.push(t);
                                        }
                                    })
                                    console.log(newtags)
                                    settags(newtags);
                                }}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Tags;