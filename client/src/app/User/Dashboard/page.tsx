'use client'
import React, {  useState } from 'react';
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import Activity from '../Activity';
import { useSelector } from 'react-redux';
import { useAuth } from '@/app/lib/slices/authSlice';
import Submissions from '../Submissions';
import { RxCross2 } from "react-icons/rx";


const Page: React.FC = () => {
	const router = useRouter();
	const {username} = useSelector(useAuth);
	const [code, setcode] = useState<string|null>(null)


	return (
		<>
		<div
		className='flex max-w-screen overflow-hidden'
		>
			<div
			className='bg-zinc-900 rounded-xl m-3 flex-1 max-w-96'
			>
			<div className="pt-16 flex flex-col items-center gap-3 no-scrollbar">
				<FaUserCircle className="w-20 h-20"/>
				<h2 className="text-md">{ username }</h2>
			</div>
			{/* <div className="pt-16 flex items-center gap-3 px-20 justify-evenly">
				<div>
					<div>Total Question Attempted: 0</div>
					<div>Total Question Solved: 0</div>
					<div>Questions Solved: None</div>
				</div>
				<div>
					<div>Duet Attepted: 0</div>
					<div>Duet Wins: 0</div>
					<div>Duet Lost: 0</div>
					<div>Duet Draw: 0</div>
				</div>
			</div> */}
			<div
			className='flex items-center justify-center'
			>
			<button 
			className='bg-gray-800 pt-1 pb-1 pl-2 text-md pr-2 rounded-xl m-1 cursor-pointer'
			onClick={()=>{
				router.push("/LeaderBoard")
			}}>LeaderBoard</button>
			</div>
			</div>
			<div
			className='overflow-scroll'
			>
			<Activity/>
			<Submissions setcode={setcode}/>
			</div>
			{
                code &&
                <div
                    className=" fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center"
                >
                    <div
                        className="  relative w-3/4 h-3/4 overflow-hidden rounded-xl bg-zinc-900 flex"
                    >
                        <pre
						className='bg-zinc-600 rounded-xl w-full p-3 m-3 overflow-scroll'
						>
                            {code}
                        </pre>
						<button
                            className="absolute right-0 top-0 m-2 scale-150 text-red-700"
                            onClick={() => {
                                setcode(null);
                            }}
                        ><RxCross2 /></button>
                    </div>
					
                </div>
            }
		</div>
		</>
	);
}

export default Page;
