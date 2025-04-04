import { Problem } from "@/app/lib/api/problemModel";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';

interface submitPayload {
    roomid: string | null
    code: string
}

interface ServerToClientEvents {
    server_report: (payload: { status: number, message: string }) => void
    created: (payload: { roomid: string, message: string }) => void
    begin: (payload: Problem) => void
    canceled: () => void
    roomlist: (payload: { roomid: string, creator: string }[]) => void
    win: () => void
    lose: () => void
    draw: () => void
}

interface ClientToServerEvents {
    start: () => void
    submit: (payload: submitPayload) => void
    surrender: (payload: string | null) => void
    cancel: (payload: string | null) => void
    getlist: (payload: { page: number, limit: number }) => void
    join: (payload: string)=>void
}

interface SocketContextType {
    initiateSocket: () => void
    startMatch: () => void
    setValue: (payload: string) => void
    setLoading: (payload: boolean) => void
    setmessage: (payload: string | null) => void
    setstart: (payload: boolean) => void
    surrenderMatch: () => void
    cancelMatch: () => void
    reset: () => void
    listMatch: () => void
    setpage: (payload: number) => void
    setlimit: (payload: number) => void
    joinMatch:(payload:string)=> void
    setmsgs:(payload:string[])=>void
    seterrs:(payload:string[])=>void
    loading: boolean
    disable: boolean
    Problem: Problem | null
    value: string
    result: boolean
    winner: boolean | null
    roomid: string | null
    message: string | null
    matchStart: boolean
    waiting: boolean
    rooms: { roomid: string, creator: string }[]
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
    initload: boolean
    msgs:string[]
    errs:string[]
}


const socketContext = createContext<SocketContextType | null>(null);

const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const SocketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

    const [initload, setinitload] = useState(true);
    const [loading, setLoading] = useState(false);
    const [waiting, setwaiting] = useState(false);
    const [rooms, setrooms] = useState<{ roomid: string, creator: string }[]>([]);
    const [winner, setwinner] = useState<boolean | null>(null);
    const [page, setpage] = useState(0);
    const [limit, setlimit] = useState(10);
    const [Problem, setProblem] = useState<Problem | null>(null);
    const [value, setValue] = useState("");
    const [roomid, setroomid] = useState<string | null>(null);
    const [disable, setdisable] = useState(false);
    const [matchStart, setstart] = useState(false);
    const timeoutid = useRef<NodeJS.Timeout | null>(null);
    const [msgs, setmsgs] = useState<string[]>([]);
    const [errs, seterrs] = useState<string[]>([]);

    const [message, setmessage] = useState<string | null>(null);
    const [result, setResult] = useState(false);

    const reset = () => {
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
            if (!SocketRef.current || !SocketRef.current.active) {
                setinitload(true);
                closeSocket();
                SocketRef.current = io("http://localhost:9310", {
                    withCredentials: true
                });
                const soc = SocketRef.current;
                if (soc) {
                    soc.on("connect_error", (e) => {
                        console.log(e)
                        seterrs([...errs, e.message]);
                    })
                    soc.on("connect", () => {
                        console.log("connected");
                        setmsgs((prev)=>[...prev,"Connected successfully."])
                        setinitload(false);
                        timeoutid.current = setInterval(() => {
                            listMatch();
                        }, 10 * 1000);
                    })
                    soc.on("created", (e) => {
                        setmsgs((prev)=>[...prev,e.message])
                        setLoading(false);
                        setwaiting(true);
                        setroomid(e.roomid);
                    })
                    soc.on("begin", (e) => {
                        setmsgs((prev)=>[...prev,"match begun."])
                        setwaiting(false);
                        setProblem(e);
                        setstart(true);
                    })
                    soc.on("canceled", () => {
                        setmsgs((prev)=>[...prev,"match canceled."])
                        setwaiting(false);
                        setLoading(false);
                    })
                    soc.on("roomlist", (e) => {
                        setrooms(e)
                    })
                    soc.on("win", () => {
                        setwinner(true);
                    })
                    soc.on("lose", () => {
                        setwinner(false);
                    })
                    soc.on("draw", () => {
                        setwinner(null);
                    })
                    soc.on("disconnect",()=>{
                        setinitload(true);
                    })
                    soc.on("server_report", (e) => {
                        console.log(e)
                        switch (e.status) {
                            case 3:
                                seterrs([...errs, e.message]);
                                // show error no change
                                break;

                            case 3.1:
                                seterrs([...errs, e.message]);
                                setLoading(false);
                                // exit room
                                break;

                            case 3.2:
                                seterrs([...errs, e.message]);
                                setwaiting(false);
                                // exit join room
                                break;
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        initiateSocket()
        return () => {
            closeSocket();
        }
    }, []);

    const closeSocket = () => {
        const soc = SocketRef.current;
        if (soc) {
            soc.off("created")
            soc.off("begin")
            soc.off("canceled")
            soc.off("roomlist")
            soc.off("win")
            soc.off("lose")
            soc.off("server_report")
            soc.disconnect();
            SocketRef.current = null;
            if(timeoutid.current){
                clearInterval(timeoutid.current);
                timeoutid.current = null;
            }
            
        }
    }

    const startMatch = () => {
        try {
            if (SocketRef.current) {
                SocketRef.current.emit('start')
                setLoading(true);

            }
        } catch (error) {
            console.log(error);
        }
    }

    const cancelMatch = () => {
        try {
            if (SocketRef.current) {
                SocketRef.current.emit('cancel', roomid)
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
                SocketRef.current.emit('surrender', roomid)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const listMatch = () => {
        if (SocketRef.current) {
            SocketRef.current.emit("getlist", { page, limit })
        }
    }

    const joinMatch = (id:string)=>{
        if (SocketRef.current ) {
            SocketRef.current.emit("join", id)
        }
    }

    return (
        <socketContext.Provider value={{
            listMatch,
            reset,
            cancelMatch,
            surrenderMatch,
            setstart,
            setLoading,
            setValue,
            setmessage,
            initiateSocket,
            startMatch,
            setpage,
            setlimit,
            joinMatch,
            setmsgs,
            seterrs,
            rooms,
            loading,
            disable,
            waiting,
            matchStart,
            Problem,
            value,
            result,
            winner,
            roomid,
            message,
            initload,
            msgs,
            errs,
            socket: SocketRef.current
        }}>
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