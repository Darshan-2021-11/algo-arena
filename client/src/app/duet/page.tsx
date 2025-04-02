'use client'
import React from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from '../lib/contexts/socketContext';
import { useEditor } from '../lib/contexts/editorContext';
import Coverpage from './coverPage';
import Codeeditor from './editor';
import Popup from './popup';

const Page = () => {
    const { reset, cancelMatch,initiateSocket, surrenderMatch, startMatch, matchStart, setLoading, setmessage, loading, disable, Problem, result, winner, roomid, message, socket } = useSocket();
    const { value } = useEditor();

    return (
        <div>
            <Popup/>
        <Coverpage/>
        {/* <Codeeditor/> */}
        </div>
        
    )
}

export default Page