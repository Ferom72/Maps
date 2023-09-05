import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, token } = body;

    const decoded = jwt.decode(token) as JwtPayload;

    if (decoded) {
      const location = await prisma.locations.findUnique({
        where: {
           address
        },
      });

      if(location !== null){
        return NextResponse.json(true)
      }else{
        return NextResponse.json(false)
      }

    } else{
        return NextResponse.json(false)
    }

  } catch (error) {
    console.error("Error handling location deletion:", error);
    return NextResponse.json(false);
  }
}
