import { Problem } from "@/app/lib/api/problemModel";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from 'socket.io-client';
import { useAuth } from "../slices/authSlice";
import { setError, setMessage } from "../slices/popupSlice";

interface submitPayload {
    roomid: string | null
    code: string
    lang: string
    id: string
}

interface ServerToClientEvents {
    server_report: (payload: { status: number, message: string }) => void
    created: (payload: { roomid: string, message: string }) => void
    begin: (payload: { problem: Problem, id: string | null }) => void
    canceled: () => void
    roomlist: (payload: { roomid: string, creator: string }[]) => void
    win: () => void
    lose: () => void
    draw: () => void
}

interface ClientToServerEvents {
    start: (payload: string) => void
    submit: (payload: submitPayload) => void
    surrender: (payload: { roomid: string, id: string }) => void
    cancel: (payload: { roomid: string, id: string }) => void
    getlist: (payload: { limit: number, id: string }) => void
    join: (payload: { roomid: string, id: string }) => void
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
    setlimit: (payload: number) => void
    joinMatch: (payload: string) => void
    // setmsgs: (payload: string[]) => void
    // seterrs: (payload: string[]) => void
    setloadmsg: (payload: string) => void
    setwinner: (payload: boolean | null) => void
    setdraw: (payload: boolean) => void
    setcode: (payload: string) => void
    setlang: (payload: string) => void
    submitMatch: ()=> void
    loading: boolean
    disable: boolean
    Problem: Problem | null
    value: string
    result: boolean
    winner: boolean | null
    draw: boolean
    roomid: string | null
    message: string | null
    matchStart: boolean
    waiting: boolean
    rooms: { roomid: string, creator: string }[]
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
    initload: boolean
    // msgs: string[]
    // errs: string[]
    loadmsg: string
    lang: string
    code: string

}


const socketContext = createContext<SocketContextType | null>(null);

const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const SocketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const { id, username } = useSelector(useAuth);

    const [initload, setinitload] = useState(true);
    const [loading, setLoading] = useState(false);
    const [waiting, setwaiting] = useState(false);
    const [rooms, setrooms] = useState<{ roomid: string, creator: string }[]>([]);
    const [winner, setwinner] = useState<boolean | null>(null);
    const [draw, setdraw] = useState(false);
    const [limit, setlimit] = useState(10);
    const [Problem, setProblem] = useState<Problem | null>(null);
    const [value, setValue] = useState("");
    const [roomid, setroomid] = useState<string | null>(null);
    const [disable, setdisable] = useState(false);
    const [matchStart, setstart] = useState(false);
    const timeoutid = useRef<NodeJS.Timeout | null>(null);
    // const [msgs, setmsgs] = useState<string[]>([]);
    // const [errs, seterrs] = useState<string[]>([]);
    const [loadmsg, setloadmsg] = useState<string>("Please wait...");
    const [lang, setlang] = useState("python");
    const [code, setcode] = useState<string>('');

    const dispatch = useDispatch();


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
                SocketRef.current = io(`http://localhost:9310`, {
                    withCredentials: true,
                    auth:{id,name:username}
                });
                const soc = SocketRef.current;
                if (soc) {
                    soc.on("connect_error", (e) => {
                        // seterrs([...errs, e.message]);
                        dispatch(setError(e.message));
                    })
                    soc.on("connect", () => {
                        // setmsgs((prev) => [...prev, "Connected successfully."])
                        dispatch(setMessage("Connected successfully."));
                        setinitload(false);
                        listMatch()
                        timeoutid.current = setInterval(() => {
                            listMatch();
                        }, 10 * 1000);
                    })
                    soc.on("created", (e) => {
                        // setmsgs((prev) => [...prev, e.message])
                        dispatch(setMessage(e.message));
                        setroomid(e.roomid);
                        setloadmsg("Waiting for opponent...")
                        setLoading(true);
                    })
                    soc.on("begin", (e) => {
                        // setmsgs((prev) => [...prev, "match begun."])
                        dispatch(setMessage("match begun."));
                        setLoading(false);
                        setProblem(e.problem);
                        e.id && setroomid(e.id);
                        setstart(true);
                    })
                    soc.on("canceled", () => {
                        // setmsgs((prev) => [...prev, ])
                        dispatch(setMessage("match canceled."));
                        setwaiting(false);
                        setLoading(false);
                    })
                    soc.on("roomlist", (e) => {
                        setrooms(e)
                    })
                    soc.on("win", () => {
                        setstart(false);
                        setwinner(true);
                        setProblem(null)
                    })
                    soc.on("lose", () => {
                        setwinner(false);
                        setstart(false);
                        setProblem(null)
                    })
                    soc.on("draw", () => {
                        setstart(false);
                        setdraw(true);
                        setProblem(null)
                    })
                    soc.on("disconnect", () => {
                        setinitload(true);
                    })
                    soc.on("server_report", (e) => {
                        switch (e.status) {
                            case 1:
                                // setmsgs([...msgs, e.message]);
                                dispatch(setMessage(e.message));
                                break;
                            case 3:
                                // seterrs([...errs, e.message]);
                                dispatch(setError(e.message));
                                break;

                            case 3.1:
                                // seterrs([...errs, e.message]);
                                dispatch(setError(e.message));
                                setLoading(false);
                                setroomid(null);
                                break;
                                
                            case 3.2:
                                // seterrs([...errs, e.message]);
                                dispatch(setError(e.message));

                                setLoading(false);
                                setroomid(null);
                                setProblem(null)
                                setstart(false)
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
            if (timeoutid.current) {
                clearInterval(timeoutid.current);
                timeoutid.current = null;
            }

        }
    }

    const startMatch = () => {
        try {
            if (SocketRef.current && id) {
                SocketRef.current.emit('start', id)
                setloadmsg("Waiting for opponent...")
                setLoading(true);

            }
        } catch (error) {
            console.log(error);
        }
    }

    const cancelMatch = () => {
        try {
            if (SocketRef.current && roomid && id) {
                SocketRef.current.emit('cancel', { roomid, id })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const surrenderMatch = () => {
        try {
            console.log(id, roomid)
            if (SocketRef.current && id && roomid) {
                SocketRef.current.emit('surrender', { roomid, id })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const listMatch = () => {
        if (SocketRef.current && id) {
            SocketRef.current.emit("getlist", { limit, id })
        }
    }

    const joinMatch = (input: string) => {
        if (SocketRef.current && id && input) {
            SocketRef.current.emit("join", { roomid: input, id });
            setloadmsg("Joining match...")
            setLoading(true);
        }
    }

    const submitMatch = () => {
        if (SocketRef.current && id) {
            SocketRef.current.emit("submit", { roomid, lang, id, code });
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
            setlimit,
            joinMatch,
            // setmsgs,
            // seterrs,
            setloadmsg,
            setwinner,
            setdraw,
            setcode,
            setlang,
            submitMatch,
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
            // msgs,
            // errs,
            loadmsg,
            draw,
            code,
            lang,
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