import { AiOutlineLoading } from "react-icons/ai";
import { useSocket } from "../lib/contexts/socketContext";

const Loading = () => {
    const { loading, loadmsg, cancelMatch, setLoading } = useSocket();
    return (
        <>
            {
                loading &&
                <div
                    className="w-screen bg-zinc-800 flex justify-center flex-col items-center"
                    style={{
                        height: "calc( 100vh - 64px )"
                    }}
                >
                    <div
                        className="flex items-center justify-center"
                    >
                        <p>{loadmsg}</p>
                        <AiOutlineLoading
                            className="animate-spin ml-3"
                        />
                    </div>

                    <button
                        className="bg-blue-900 w-16 hover:bg-blue-600 pt-1 pb-1 pl-2 pr-2 mt-4 rounded-2xl text-md select-none "
                        style={{
                            boxShadow: `6px 7px 10px 2px rgb(0 0 0 / 75%)`
                        }}
                        onClick={()=>{
                            setLoading(false)
                            cancelMatch()
                        }}
                    >cancel</button>
                </div>
            }
        </>
    )
}

export default Loading;