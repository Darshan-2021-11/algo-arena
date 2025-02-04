'use client'
import React, { useEffect, useState, useRef } from "react";
import style from "./Nav.module.css";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,firestore } from "@/app/Firebase/config";
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Nav: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession  = useRef<string|null>(null);

  useEffect(()=>{
    userSession.current = sessionStorage.getItem('user');
  },[])

  const [userName, setUserName] = useState<string | null>();
  
  // const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData();
      } else {
        setUserName(null); // Reset if the user logs out
        router.push('/')
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, [auth, firestore]);

  useEffect(() => {
  	if (typeof window !== 'undefined' && userName != null)
  	window.sessionStorage.setItem('userName', userName);
	}, [userName])

  return (
    <div className={[style.bg].join(" ")}>
      <div className={style.left}>
        <Link href={"/Home"} className={[style.img].join(" ")}>
          AlgoArena
          {/* <img className={[style.img].join(" ")} src="/algoarena.png" alt="AlgoArena logo" /> */}
        </Link>

        <div className={[style.p].join(" ")}>
          <h6>
            <Link href={"/Problems"}>Practice</Link>
          </h6>
        </div>
        <div className={[style.e].join(" ")}>
        <Link href={"/Explore"}>Explore</Link>
        </div>
      </div>
      <div className={style.left}>
        <div>
          {!user && !userSession.current ? (
            <div className={style.left}>
              <div className={[style.s].join(" ")}>
                <h6>
                  <Link href={"/Sign-up"}>Sign up</Link>
                </h6>
              </div>
              <div className={[style.l].join(" ")}>
                <h6>
                  <Link href={"/Sign-in"}>Log in</Link>
                </h6>
              </div>
            </div>
          ) : (
            <div className={style.left}>
              <div className={[style.e].join(" ")}
             
              >
              {userName ? (<div className={style.left}
               onClick={
                router.push('/User/Dashboard')
              }
              >
                <img className={[style.im].join(" ")} src="/person.png" alt="Profile_Picture" />
          <span className="text-blue-600 text-sm"> {userName} </span>
          </div>
        ) : (
          <a href="/Sign-in" className="text-blue-400">Log in</a>
        )}
              </div >
              <button className="text-red-600 ml-5 pl-1 text-sm" onClick={() => {
        signOut(auth)
        sessionStorage.removeItem('user')
        router.push('/Home')
        }}>
        Log out
      </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Nav;
