import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = body;
    const { token, locationtoken } = data;

    const decoded = jwt.decode(token) as JwtPayload;
    const locationdecoded = jwt.decode(locationtoken) as JwtPayload;

    console.log(decoded);

    if (decoded) {
      const userId = decoded.id as string;
      const email = decoded.email as string;

      const userLocations = await prisma.user.findUnique({
        where: {
          id: userId,
          email,
        },
        include: {
          savedLocations: true,
        },
      });

      console.log(locationdecoded.address);

      const res = userLocations?.savedLocations.find((location) => {
        return location.address === locationdecoded.address;
      });

      console.log(res);

      return NextResponse.json(res);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error fetching user locations:", error);
    return NextResponse.json({ success: false });
  }
}
