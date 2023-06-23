import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const search  = request.nextUrl?.searchParams.get('search') || "";

    const db = await connectMongoDb();
    const metadataCollection = db.collection("Metadata");

    // Create index on exif.make field if it doesn't exist
    const indexOptions = { background: true };
    await metadataCollection.createIndex({ "exif.make": 1 }, indexOptions);

    const aggregationPipeline = [
      {
        $match: {
          "exif.make": { $regex: search, $options: "i" },
        },
      },
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

    const groupedMake: {make:string}[] = await metadataCollection.aggregate(aggregationPipeline).toArray();

    const makeGroups = groupedMake.map((group) => group.make);

    return NextResponse.json({ makeGroups }, { status: 200 });

  } catch (error) {
    return NextResponse.json(`Failed to fetch make groups: ${error}`, { status: 200 });
  }
};
