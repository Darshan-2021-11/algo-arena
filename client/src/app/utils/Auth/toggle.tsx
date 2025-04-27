import { Dispatch, useState } from "react"

interface proptype {
    left: string
    right: string
    p:boolean
    setp:Dispatch<React.SetStateAction<boolean>>
}

const Toggle: React.FC<proptype> = ({ left, right, p, setp }) => {

    return (
        <div className="flex items-center justify-start w-fit font-sans ">
            <div
                onClick={() => { setp(prev => !prev) }}
                className="bg-zinc-700 rounded-xl w-10 relative h-5 mr-3">
                <div
                    className={` bg-white h-5 w-5 absolute ${p ? " animate-slideLeft left-0" : " animate-slideRight left-1/2"} top-0 rounded-full `}></div>
            </div>
            <div className="text-white">{p ? left : right}</div>
        </div>
    )
}

export default Toggle;