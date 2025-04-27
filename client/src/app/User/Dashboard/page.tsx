'use client'
import React, {  useState } from 'react';
import { useRouter } from "next/navigation";
import Activity from '../Activity';
import { useSelector } from 'react-redux';
import { useAuth } from '@/app/lib/slices/authSlice';
import Submissions from '../Submissions';
import { RxCross2 } from "react-icons/rx";
import Dp from '@/app/utils/Auth/dp';


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
			<div className="pt-16 flex flex-col items-center gap-3 no-scrollbar ">
				<Dp size='big' />
				<h2 className="text-md">{ username }</h2>
			</div>
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
