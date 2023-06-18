import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (
  request: NextRequest,

  ) => {

  try {
    
    const page = request.nextUrl.searchParams.get('page') || 1
    //const root_class = request.nextUrl.searchParams.get('root_class') || 1


    const limit = 20;


    const db = await connectMongoDb();
    const collection = db.collection('Thumb');


    const totalItem = await collection.countDocuments()
    const totalPage = Math.ceil(totalItem / limit)
    const skip = ( +page - 1 )*limit

    const thumbImages = await collection
                              .find({})
                              .skip(skip)
                              .limit(limit)
                              .toArray()

    const jsonResponse = {
      page,
      totalPage,
      thumbImages
    }

    return NextResponse.json(jsonResponse , { status: 200 });

  } 
  catch (error) 
  {
    return NextResponse.json(`Failed to fetch all images, ${error}` , { status: 200 });
  }
};
