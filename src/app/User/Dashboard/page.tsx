'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import Activity from '../Activity';
import { useSelector } from 'react-redux';
import { useAuth } from '@/app/lib/slices/authSlice';

const Page: React.FC = () => {
	const router = useRouter();
	const {username} = useSelector(useAuth);


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
			</div>
		</div>
		</>
	);
}

export default Page;
