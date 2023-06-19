import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";


interface Query {
  root_class? : string
}

export const GET = async (
  request: NextRequest,

  ) => {

  try 
  {
    
    const page = request.nextUrl?.searchParams?.get('page') || 1

    const tag  = request.nextUrl?.searchParams?.get('tag')

    const limit = 20;


    const db = await connectMongoDb();
    const collection = db.collection('metadata');

    let query: Query = {}

    if(tag) {
      query.root_class = tag
    }
  

    const totalItem = await collection.countDocuments(query)
    const totalPage = Math.ceil(totalItem / limit)
    const skip = ( +page - 1 )*limit
    

    const metadata = await collection
                              .find(query, { projection: { _id: false } } )
                              .skip(skip)
                              .limit(limit)
                              .toArray()

    const jsonResponse = {
      page: page,
      per_page: limit,
      total_page: totalPage,
      metadata: metadata
    }

    return NextResponse.json(jsonResponse , { status: 200 });

  } 
  catch (error) 
  {
    return NextResponse.json(`Failed to fetch all images, ${error}` , { status: 200 });
  }
};

export const dynamic = 'force-dynamic'
