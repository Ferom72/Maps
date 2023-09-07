import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;
    const decoded = jwt.decode(token) as JwtPayload;

    if (decoded) {
      const userId = decoded.id as string;
      const email = decoded.email as string;

      const userLocations = await prisma.user
        .findUnique({
          where: {
            id: userId,
            email,
          },
        })
        .savedLocations();

      return NextResponse.json(userLocations);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error fetching user locations:", error);
    return NextResponse.json({ success: false });
  }
}
