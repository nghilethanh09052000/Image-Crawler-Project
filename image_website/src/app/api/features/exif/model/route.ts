import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const  search  = request.nextUrl?.searchParams.get('search') || "";

    const db = await connectMongoDb();
    const metadataCollection = db.collection("Metadata");

    // Create index on exif.model field if it doesn't exist
    const indexOptions = { background: true };
    await metadataCollection.createIndex({ "exif.model": 1 }, indexOptions);

    const aggregationPipeline = [
      {
        $match: {
          "exif.model": { $regex: search, $options: "i" },
        },
      },
      {
        $group: {
          _id: "$exif.model",
        },
      },
      {
        $project: {
          model: "$_id",
          _id: 0,
        }
      },
      {
        $limit: 30, 
      }
    ];

    const groupedModel: {model:string}[] = await metadataCollection.aggregate(aggregationPipeline).toArray();

    const modelGroups = groupedModel.map((group) => group.model);

    return NextResponse.json({ modelGroups }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(`Failed to fetch model groups: ${error}`, { status: 200 });
  }
};
