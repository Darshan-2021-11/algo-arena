'use client'
import Image from "next/image";
import { Provider } from "react-redux";
import store from "./store";


export default function Home() {
  return (
    <Provider
    store={store}
    >
      <main > 
      </main>
    </Provider>
  );
}
