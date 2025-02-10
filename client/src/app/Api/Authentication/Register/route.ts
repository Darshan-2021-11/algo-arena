'use server'

import mongoose from 'mongoose';
import User from '@/app/Api/models/userModel';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/algo-arena");

  const { name, email, password } = await request.json();
  console.log(name, email, password)
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({
      name,
      _id: email,
      password: hashedPassword,
    });
    await user.save();
    return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'User registration failed!' }, { status: 400 });
  }
}
