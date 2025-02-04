import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
    <div
    className='pt-16'
    >
        <Link
        // style={{
        //     borderRadius:'59% 12% 68% 16% / 64% 0% 28% 10% '
        // }}
        href={"/duet"}
        className='text-white cursor-pointer rounded-3xl ml-10 opacity-100 hover:opacity-70 flex justify-center items-center text-3xl bg-gray-700  w-36 h-36'
        >
            Duet

        </Link>
    </div>
    )
}

export default page
