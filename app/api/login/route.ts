import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"
import jwt from "jsonwebtoken";


export async function POST(
    request: Request
){
    try{
        const body = await request.json()
        const {
            email,
            password
        } = body

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if(!user){
            return new NextResponse('Invalid Credentials', { status: 400 });
        }else{
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword as string);

            if(passwordMatch){

                const temp = process.env.NEXT_PUBLIC_SECRET_KEY as string

                const token = jwt.sign({
                    id: user.id, email: user.email
                },
                temp
                ,
                {},
                )
            
                return NextResponse.json(token)
            }else if(!passwordMatch){
                return NextResponse.json(false)
            }
        }
    }catch{
        console.log("error")
    }
}