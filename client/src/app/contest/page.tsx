"use client";

import OngoingContests from "./OngoingContests";
import PastContests from "./PastContests";
import UpcomingContests from "./UpcomingContests";

const Page = () => {
 

  return (
    <div className="container mx-auto overflow-y-hidden">
     <UpcomingContests/>
     <OngoingContests/>
     <PastContests/>
    </div>
  );
};

export default Page;
