import { useEffect } from "react";
import { useSocket } from "../lib/contexts/socketContext";

const Resultpage = () => {
    const { winner, setwinner, draw, setdraw } = useSocket();
    useEffect(() => {
        console.log(draw)
    }, [draw])
    return (
        <>
            {
                (winner !== null || draw) &&
                <div
                    className="w-screen bg-zinc-800 flex justify-center flex-col items-center"
                    style={{
                        height: "calc( 100vh - 64px )"
                    }}
                >
                    <div
                        className={` ${ !draw ? winner ? "text-green-700" : "text-red-700" : " text-yellow-400"}  flex items-center justify-center text-xl`}
                    >
                        <p>{!draw ?winner ? "Congratulations! you won the match." : "You lost the match. Better luck next time." : "Time out none of you could solve the problem with in time."}</p>
                    </div>

                    <button
                        className="bg-blue-900 w-16 hover:bg-blue-600 pt-1 pb-1 pl-2 pr-2 mt-4 rounded-2xl text-md select-none "
                        style={{
                            boxShadow: `6px 7px 10px 2px rgb(0 0 0 / 75%)`
                        }}
                        onClick={() => {
                            setwinner(null);
                            setdraw(false);
                        }}
                    >back</button>
                </div>
            }
        </>
    )
}

export default Resultpage;