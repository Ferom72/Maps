import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, token } = body;

    const decoded = jwt.decode(token) as JwtPayload;

    if (decoded) {
      const userId = decoded.id as string;

      const location = await prisma.locations.findUnique({
        where: {
           userId: userId,
           address: address
        },
      });

      if (location && location.userId === userId) {
        const result = await prisma.locations.delete({
          where: {
            id: location.id,
            address:address
          },
        });

        return NextResponse.json(result);
      } else {
        return NextResponse.json(false);
      }
    } else {
        return NextResponse.json(false);
    }
  } catch (error) {
    console.error("Error handling location deletion:", error);
    return NextResponse.json(false);
  }
}
