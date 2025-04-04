import { AiOutlineLoading } from "react-icons/ai";
import { useSocket } from "../lib/contexts/socketContext";
import { v4 } from "uuid";

const CoverPage: React.FC = () => {
    const { matchStart, winner, draw, startMatch, loading, waiting, cancelMatch, setlimit, rooms, initload, joinMatch } = useSocket();



    return (
        <>
            {(!matchStart && winner === null && !draw) &&
                <div
                    className=" w-screen bg-zinc-900  overflow-hidden pt-4"
                    style={{
                        height: 'calc( 100vh - 64px )'
                    }}
                >
                    <div
                        className="grid grid-cols-3 mt-1 mb-1 bg-zinc-800 m-2 rounded-lg p-1"
                    >
                        <p
                            className="pl-2 flex items-center justify-center"
                        >Opponents</p>
                        <div>   </div>
                        <div
                            className=""
                        >
                            <div
                                className="flex items-center justify-center"
                            >
                                {
                                    waiting ?
                                        <button
                                            className="bg-blue-900 w-16 hover:bg-blue-600 pt-1 pb-1 pl-2 pr-2 rounded-2xl text-md select-none "
                                            style={{
                                                boxShadow: `6px 7px 10px 2px rgb(0 0 0 / 75%)`
                                            }}
                                            onClick={cancelMatch}
                                        >cancel</button>

                                        :

                                        <>
                                            {
                                                !loading ?
                                                    <>
                                                        {
                                                            initload ?
                                                                <button
                                                                    className="bg-blue-900 opacity-70 w-16 cursor-not-allowed pt-1 pb-1 pl-2 pr-2 rounded-2xl text-md select-none "
                                                                    style={{
                                                                        boxShadow: `6px 7px 10px 2px rgb(0 0 0 / 75%)`
                                                                    }}

                                                                >create</button>
                                                                :
                                                                <button
                                                                    className="bg-blue-900 w-16 hover:bg-blue-600 pt-1 pb-1 pl-2 pr-2 rounded-2xl text-md select-none "
                                                                    style={{
                                                                        boxShadow: `6px 7px 10px 2px rgb(0 0 0 / 75%)`
                                                                    }}
                                                                    onClick={startMatch}
                                                                >create</button>
                                                        }

                                                    </>
                                                    :
                                                    <button
                                                        className="bg-blue-900 w-16 hover:bg-blue-600 pt-1 pb-1 pl-2 pr-2 rounded-2xl text-md select-none "
                                                        style={{
                                                            boxShadow: `6px 7px 10px 2px rgb(0 0 0 / 75%)`
                                                        }}
                                                    >
                                                        <AiOutlineLoading
                                                            className=" animate-spin"
                                                        />
                                                    </button>
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex flex-row-reverse mt-6 "
                    >

                        <div>
                            limit <input
                                className="selcet-none m-1 p-1 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                                type="number"
                                defaultValue={10}
                                min={10}
                                max={100}
                                onChange={(e) => {
                                    setlimit(Number(e.target.value))
                                }}
                                placeholder="limit" />
                        </div>

                    </div>
                    <div
                        className="flex flex-col w-screen overflow-scroll bg-zinc-800"
                        style={{
                            height: "60vh"
                        }}
                    >
                        {
                            rooms.map((r, i) => (
                                <div
                                    className="grid grid-cols-3 m-2 bg-zinc-600 pt-1 pb-1 pl-2 rounded-lg hover:bg-zinc-700"
                                    key={v4()}
                                >
                                    <p
                                        className="text-white flex items-center"
                                    >{i + 1}</p>
                                    <p
                                        className="text-white flex items-center justify-start"
                                    >{r.creator}</p>
                                    <div
                                        className="flex items-center justify-center"
                                    >
                                        <button
                                            className="bg-green-900 hover:bg-green-500 pl-3 pr-3 pt-2 pb-2 w-14 cursor-pointer rounded-xl shadow-md shadow-gray-600"
                                            onClick={() => joinMatch(r.roomid)}
                                        >
                                            join
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                        {rooms.length == 0 && <div>No available opponents.</div>}
                    </div>






                </div>
            }
        </>

    )
}
export default CoverPage;