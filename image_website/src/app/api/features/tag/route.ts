import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const db = await connectMongoDb();
    const metadataCollection = db.collection("Metadata");

     // Check if index already exists
     const indexExists = await metadataCollection.indexExists("root_class");

     if (!indexExists) {
       // Create index for root_class field
       await metadataCollection.createIndex({ root_class: 1 }), { background: true };
     }




    const aggregationPipeline = [
      {
        $group: {
          _id: "$root_class",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          root_class: "$_id",
          _id: 0,
        },
      },
    ];

    const groupedRootClass: {root_class:string}[] = await metadataCollection.aggregate(aggregationPipeline).toArray();
    const rootClassGroups = groupedRootClass.map((group)=>group.root_class)

    const jsonResponse = {
      tagsList: rootClassGroups,
    };

    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(`Failed to fetch root class groups: ${error}`, { status: 200 });
  }
};
