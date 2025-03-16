'use client'

import EditorProvider from "@/app/lib/contexts/editorContext";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){

    return <>
    <EditorProvider>
    {children}
    </EditorProvider>
    </>
}