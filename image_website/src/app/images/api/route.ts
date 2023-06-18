import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,

  ) => {

  try {
    
    const tag  = request.nextUrl?.searchParams?.get('tag')
    const page = request.nextUrl?.searchParams?.get('page') || 1



    

    return NextResponse.json(tag , { status: 200 });

  } 
  catch (error) 
  {
    return NextResponse.json(`Failed to fetch all images, ${error}` , { status: 200 });
  }
};

export const dynamic = 'force-dynamic'
