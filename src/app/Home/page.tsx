import React from 'react';
import style from './Home.module.css'

const Page: React.FC = () => {
  return (
    <div className={[style.you].join(" ")}>
      <div>
      <h1 className={[style.l].join(" ")}>Code, Compete, Conquer!</h1>
      <p className={[style.h].join(" ")}>Unleash your skills, climb the leaderboards, and emerge as the ultimate coding champion.</p>
      </div>
      
    </div>
  );
}

export default Page;
