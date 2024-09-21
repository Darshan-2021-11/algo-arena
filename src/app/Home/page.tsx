import React from 'react';
import style from './Home.module.css'

const Page: React.FC = () => {
  return (
    <div className={[style.you, style.l].join(" ")}>
      Hello this is home page
    </div>
  );
}

export default Page;
