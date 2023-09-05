import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'

export async function POST(
  request: Request
) {
  const body = await request.json();
  const {
    email,
    name,
    password
  } = body;

  const existUser = await prisma.user.findUnique({
    where:{email}
  })

  if(existUser){
    return NextResponse.json(false)
  }else{
    
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword
    }
  });

  return NextResponse.json(user);
}