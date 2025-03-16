import { Problem } from "@/app/Api/models/problemModel";
import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';

interface matchpayload {
    problemid: string,
    roomid: string
}

interface submitPayload {
    roomid: string | null
    code: string
}

interface ServerToClientEvents {
    matching: () => void
    matchstart: (payload: matchpayload) => void
    status: (payload: string) => void
    matchEnd: (payload: string) => void
}

interface ClientToServerEvents {
    startMatch: () => void
    submit: (payload: submitPayload) => void
    surrenderMatch: (payload:string | null) => void
    cancelMatch: (payload:string|undefined) => void
}

interface SocketContextType {
    initiateSocket: () => void
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined
    startMatch: () => void
    loading: boolean
    disable: boolean
    Problem: Problem | null
    value: string
    result: boolean
    winner: string | null
    roomid: string | null
    message: string | null
    setValue: (payload: string) => void
    setLoading: (payload: boolean) => void
    setmessage: (payload: string | null) => void
    setstart: (payload: boolean) => void
    matchStart: boolean
    surrenderMatch: () => void
    cancelMatch: () => void
    reset:()=>void
}


const socketContext = createContext<SocketContextType | null>(null);
const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const SocketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();

    const [loading, setLoading] = useState(false);
    const [disable, setdisable] = useState(false);
    const [Problem, setProblem] = useState(null);
    const [value, setValue] = useState("");
    const [result, setResult] = useState(false);
    const [winner, setwinner] = useState<string | null>(null);
    const [roomid, setroomid] = useState<string | null>(null);
    const [message, setmessage] = useState<string | null>(null);
    const [matchStart, setstart] = useState(false);

    const reset =()=>{
        setLoading(false);
        setdisable(false);
        setProblem(null);
        setValue("");
        setResult(false);
        setwinner(null);
        setroomid(null);
        setmessage(null);
        setstart(false);
    }

    const initiateSocket = () => {
        try {
            if (!SocketRef.current) {
                SocketRef.current = io("http://localhost:9310");
                console.log(SocketRef.current)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const startMatch = () => {
        try {
            if (SocketRef.current) {
                SocketRef.current.emit('startMatch')
                setLoading(true);

            }
        } catch (error) {
            console.log(error);
        }
    }

    const cancelMatch = () => {
        try {
            if (matchStart) {
                // match already started can not cancel match now
                return;
            }
            if (SocketRef.current) {
                SocketRef.current.emit('cancelMatch',SocketRef.current.id)
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const surrenderMatch = () => {
        try {
            if (!matchStart) {
                return;
            }
            if (SocketRef.current) {
                SocketRef.current.emit('surrenderMatch',roomid)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        try {
            initiateSocket();
            const soc = SocketRef.current;
            if (soc) {
                soc.on("connect", () => {
                    console.log("connected");
                })
                soc.on("matching", () => {
                    setdisable(true);
                })
                soc.on("matchstart", async (d) => {
                    const url = `/Api/Problems/GetProblembyId?id=${d.problemid}`;
                    const { data } = await axios.get(url);
                    setProblem(data.response.problem);
                    setroomid(d.roomid)
                    setLoading(false);
                    setstart(true);
                })
                soc.on("status", (d) => {
                    setmessage(d);
                })
                soc.on("matchEnd", (d) => {
                    if (d) {
                        console.log(soc.id,d)
                        if (d === soc.id) {
                            setwinner('you');
                        } else {
                            setwinner('opponent');
                        }
                    }
                    setResult(true);
                })
                return () => {
                    soc.off("matchstart");
                    soc.off('status');
                    soc.off('matchEnd');
                    soc.off('matching');
                }
            }
        } catch (error) {
            console.log(error);
        }

    }, [])

    return (
        <socketContext.Provider value={{ reset, cancelMatch, surrenderMatch, matchStart, setstart, setLoading, setValue, setmessage, loading, disable, Problem, value, result, winner, roomid, message, initiateSocket, socket: SocketRef.current, startMatch }}>
            {children}
        </socketContext.Provider>
    )
}

export default SocketProvider;

export const useSocket = () => {
    const context = useContext(socketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
} 