'use client'
import axios from "@/app/lib/errorhandler";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

interface props {
    id:string
}

const Activity: React.FC<props> = ({id}) => {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currentYear = new Date().getFullYear();
    const [calendar, setcalender] = useState<{ month: number, days: (number | null)[] }[]>([]);
    const [years, setyears] = useState<number[]>([currentYear]);
    const [year, sety] = useState<number | null>();

    const getActivity = async (): Promise<{ date: Date, submissions: number }[]> => {
        let arr: { date: Date, submissions: number, start: Date }[] = [];
        try {
            const y = Number(new Date().getFullYear());
            const url = `/Api/Activity?y=${year != null ? year : y}&id=${id}`;
            const { data } = await axios.get(url);
            if (data.success && data.activity !== null) {
                arr = data.activity;
                const sy = new Date(data.start || "").getFullYear();
                const ey = new Date().getFullYear();
                const yarr = [];
                for (let i = sy ? sy : y; i <= ey; i++) {
                    yarr.push(i);
                }
                setyears(yarr);
            }
        } catch (error) {
            console.log(error)
        } finally {
            return arr;
        }
    }

    const generateCalender = async () => {
        const act = await getActivity();
        console.log(act)

        const date = new Date();
        const year = date.getFullYear();
        const md = [...monthDays];
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            md[1] = 29;
        }

        const cal: { month: number, days: (number | null)[] }[] = [];
        for (let month = 0; month < 12; month++) {
            const days = [];
            const firstDay = new Date(year, month, 1).getDay();

            for (let i = 0; i < firstDay; i++) {
                days.push(null);
            }

            for (let day = 1; day <= md[month]; day++) {
                days.push(0);
            }

            cal.push({ month: month + 1, days })
        }
        act.map(({ date, submissions }) => {
            const d = new Date(date);
            const m = d.getMonth();
            let c = cal[m];
            let diff = Math.abs(md[m] - c.days.length);
            diff > 0 && diff--;
            c.days[diff + d.getDate()] = submissions;
            cal[m] = c;
        })
        setcalender(cal);
    }

    useEffect(() => {
        const y = Number(new Date().getFullYear());
        sety(y);
        generateCalender()
    }, [])

    return (
        <div
            className="relative w-fit h-fit shadow-md shadow-zinc-900  bg-zinc-900 mb-3 mt-3 pl-2 pr-2 overflow-hidden"
        >
            <div
            className="flex"
            >
            <select
                className="sticky left-0 top-0 h-6 rounded-3xl outline-none text-black p-1"
            >
                {
                    years.map((y) => (
                        <option
                            key={v4()}
                        >
                            {y}
                        </option>
                    ))
                }
            </select>
            <div
                className="sticky left-20 top-0 h-6 rounded-3xl outline-none text-white p-1"
            >
                Activity
            </div>
            </div>
           
            <div
                className="flex justify-evenly mt-4 pt-4 pb-5"
            >



                {calendar.map((c) => (
                    <div key={c.month}
                        className="m-1"
                        id={v4()}
                    >
                        <div className="grid grid-rows-7 grid-flow-col gap-1">
                            {c.days.map((i, index) => (
                                <div
                                    id={v4()}
                                    key={index}
                                    className={`w-1.5 h-1.5 flex items-center justify-center ${i !== null ? i > 0 ? "bg-green-600" : "bg-zinc-600" : "bg-transparent"
                                        }`}
                                >
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Activity;