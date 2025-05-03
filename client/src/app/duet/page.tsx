'use client'
import React from 'react'
import Coverpage from './coverPage';
import Loading from './Loading';
import Codeeditor from './editor';
import Resultpage from './Resultpage';

const Page = () => {

    return (
        <div>
            <Loading />
            <Coverpage />
            <Codeeditor/>
            <Resultpage/>
        </div>

    )
}

export default Page