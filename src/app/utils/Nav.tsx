'use client'
import React from "react";
import style from "./Nav.module.css";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,firestore } from "@/app/firebase/config";
import { signOut } from 'firebase/auth';
import {  onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Nav: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');
  console.log({ user });

  const [userName, setUserName] = useState<string | null>(null);
  
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
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, [auth, firestore]);

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
          <h6>Explore</h6>
        </div>
      </div>
      <div className={style.left}>
        <div>
          {!user && !userSession ? (
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
              <div className={[style.e].join(" ")}>
              {userName ? (<div className={style.left}>
                <img className={[style.im].join(" ")} src="/person.png" alt="AlgoArena logo" />
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
