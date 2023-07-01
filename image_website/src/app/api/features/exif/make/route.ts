import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const db = await connectMongoDb();
    const metadataCollection = db.collection("Metadata");

    // Create index for exif.make field
    await metadataCollection.createIndex({ "exif.make": 1 }, { background: true });

    const aggregationPipeline = [
      {
        $group: {
          _id: "$exif.make",
        },
      },
      {
        $project: {
          make: "$_id",
          _id: 0,
        },
      },
    ];

    const groupedMake: { make: string }[] = await metadataCollection.aggregate(aggregationPipeline).toArray();
    const makeGroups = groupedMake.map((group) => group.make);

    const jsonResponse = {
      makeGroups: makeGroups,
    };

    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(`Failed to fetch make groups: ${error}`, { status: 200 });
  }
};
