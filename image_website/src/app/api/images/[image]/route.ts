import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (
    request: NextRequest,
    { params }: { params: {image: string } }
    ) => {
  
    try {
        const image = params.image
        
        const db = await connectMongoDb();
        const collection = db.collection('metadata');

        const imageDetails = await collection.findOne({image:image}, { projection: { _id: false } })
        return NextResponse.json(imageDetails , { status: 200 });
  
    } 
    catch (error) 
    {
      return NextResponse.json(`Failed to fetch all images, ${error}` , { status: 200 });
    }
  };
  