"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { contestmodel } from "../lib/api/contestModel";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';

interface contestmodel_id extends contestmodel {
    _id: string
};

const Page = () => {
  const [contests, setContests] = useState<Array<contestmodel_id>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const url = `Api/Contests/GetAllContests`;
        const response = await axios.get(url);

        if (response.data?.success) {
          setContests(response.data.Contest);
          setLoading(false);
        } else {
          console.error("Failed to fetch contests:", response.data?.message);
        }
      } catch (error: any) {
        console.error(
          "Error fetching contests:",
          error.response?.data || error.message
        );
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Contests</h1>
      {loading ? (
        <p>Loading contests...</p>
      ) : (
        <ul className="space-y-4">
          {contests.map((contest) => (
            <Link key={uuidv4()} href= {`/contest/${contest._id}`}>
            <li key={uuidv4()} className="bg-gray-500 p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold">{contest.name}</h2>
              <p>Start Time: { new Date(contest.startTime).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
 }) }</p>
              <p>End Time: { new Date(contest.endTime).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', }) }</p>
            </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
