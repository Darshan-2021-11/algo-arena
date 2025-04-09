'use client'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
    <div
    className='flex pt-4'
    >
        <Link
        
        href={"/duet"}
        className='text-white cursor-pointer rounded-3xl ml-10 opacity-100 hover:opacity-70 flex justify-center items-center text-3xl bg-gray-700  w-36 h-36'
        >
            Duet

        </Link>
        <Link
        
        href={"/contest"}
        className='text-white cursor-pointer rounded-3xl ml-10 opacity-100 hover:opacity-70 flex justify-center items-center text-3xl bg-gray-700  w-36 h-36'
        >
            Contest

        </Link>
    </div>
    )
}

export default page
