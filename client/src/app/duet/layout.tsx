'use client'
import EditorProvider from "../lib/contexts/editorContext"
import SocketProvider from "../lib/contexts/socketContext"

export default function duelLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (    
      <>
      {children}
      </>
    )
  }