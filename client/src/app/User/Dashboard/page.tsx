'use client'
import React, { useRef, useEffect, useState } from 'react';
import Nav from '../../utils/Nav';
import { FaUserCircle } from "react-icons/fa";

const Page: React.FC = () => {
	const [userName, setUserName] = useState<String | null>('John Doe');
	useEffect(() => {
		if (typeof window !== null) {
			const name = window.sessionStorage.getItem('userName');
			if (name !== null)
				setUserName(name);
		}
	}, []);

	return (
		<>
			<div className="pt-16 flex flex-col items-center gap-3">
				<FaUserCircle className="w-40 h-40"/>
				<h2 className="text-2xl">{ userName }</h2>
			</div>
			<div className="pt-16 flex items-center gap-3 px-20 justify-evenly">
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
			</div>
		</>
	);
}

export default Page;
