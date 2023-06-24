import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {

    const db = await connectMongoDb();
    const metadataCollection = db.collection("Metadata");



    const aggregationPipeline = [
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
      }
    ];

    const groupedModel: {model:string}[] = await metadataCollection.aggregate(aggregationPipeline).toArray();

    const modelGroups = groupedModel.map((group) => group.model);

    return NextResponse.json({ modelGroups }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(`Failed to fetch model groups: ${error}`, { status: 200 });
  }
};
