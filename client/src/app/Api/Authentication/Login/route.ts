'use server'

import mongoose from 'mongoose';
import User from '../../models/userModel';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/algo-arena");

  const { email, password } = await request.json();

  try {
    const user = await User.findById(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found!' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password!' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Login successful!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed!' }, { status: 500 });
  }
}
