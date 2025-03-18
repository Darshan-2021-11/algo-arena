'use server'
import { NextResponse } from "next/server"

export const fail = (message?: string, status?: number) => {
    return NextResponse.json(
        { 
            message:message ? message : "Something went wrong.", 
            success: false 
        }, 
        { status: status ? status : 500 }
    );
}

export const success = (message: string, body?: any, status?: number) => {
    return NextResponse.json(
        { message, success: true, body }, 
        { status: status ? status : 200 }
    );
}