import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,

  ) => {

  try {

    const tag  = request.nextUrl?.searchParams?.get('tag') || ''
    const page = request.nextUrl?.searchParams?.get('page') || 1

    const limit = 20;
   
    const db = await connectMongoDb();
    const collection = db.collection('Thumb');

    const totalItem = await collection.countDocuments({root_class: tag})
    const totalPage = Math.ceil(totalItem / limit)
    const skip = ( +page - 1 )*limit

    const thumbImages = await collection
                              .find({root_class: tag}, { projection: { _id: false } })
                              .skip(skip)
                              .limit(limit)
                              .toArray()

    const jsonResponse = {
      page: page,
      perPage: limit,
      totalPage: totalPage,
      thumbImages: thumbImages
    }


    return NextResponse.json(jsonResponse , { status: 200 });

  } 
  catch (error) 
  {
    return NextResponse.json(`Failed to fetch all images, ${error}` , { status: 200 });
  }
};

export const dynamic = 'force-dynamic'