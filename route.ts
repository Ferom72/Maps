import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import jwt, { JwtPayload } from "jsonwebtoken";


export async function POST(
    request: Request
){
    try {
        const body = await request.json();

        const {
            name,
            address,
            lat,
            lng,
            token
        } = body

        const decodedToken = jwt.decode(token) as JwtPayload

        if(decodedToken){

            const userId = decodedToken.id

            const location = await prisma.locations.findUnique({
              where: {
                 userId: userId,
                 address: address
              },
            });

          if(!location){

            await prisma.locations.create({
              data: {
                name: name,
                address: address,
                lat: lat,
                lng: lng,
                user: {
                  connect: {
                    id: userId,
                  },
                },
              },
            });

            return NextResponse.json(true)
          }else{
            return NextResponse.json("already saved")
          }
        }else{
            return NextResponse.json(false)
        }        
    } catch (error) {
        console.error("Error handling location:", error);
        return NextResponse.json({ success: false });
    }
}
