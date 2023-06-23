import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { ImageDetailsResponse } from "@/types";

interface Query {
  root_class?: string;
  title?: { $regex: string; $options: string };
  uploaded?: { $gte: string; $lte: string };
}

interface SortOptions {
  [key: string]: number;
}

export const GET = async (request: NextRequest) => {
  try {
    
    const page = request.nextUrl?.searchParams?.get('page') || '1';
    const limit = 20;
    const skip = (parseInt(page, 10) - 1) * limit;

    const tag = request.nextUrl?.searchParams?.get('tag');
    const title = request.nextUrl?.searchParams?.get('title');
    const orderBy = request.nextUrl?.searchParams?.get('orderBy');
    const startDateParam = request.nextUrl?.searchParams?.get('startDate');
    const endDateParam = request.nextUrl?.searchParams?.get('endDate');

    const db = await connectMongoDb();
    const metadataCollection = db.collection('Metadata');
    const thumbCollection = db.collection('Thumb');

    let query: Query = {};

    if (tag) {
      query.root_class = tag;
    }

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (startDateParam && endDateParam) {
      query.uploaded = {
        $gte: startDateParam,
        $lte: endDateParam,
      };
    }

    const sortOptions: SortOptions = {};

    if (orderBy === 'views') sortOptions['stat.views'] = -1;
    if (orderBy === 'likes') sortOptions['stat.likes'] = -1;
    if (orderBy === 'comments') sortOptions['stat.comments'] = -1;
  

    let totalItem;
    let metadata;
    let imageNames;
    let thumbnails;

    if (Object.keys(query).length === 0) 
    {
      totalItem = await thumbCollection.countDocuments();
      thumbnails = await thumbCollection
        .find({}, { projection: { _id: false } } )
        .skip(skip)
        .limit(limit)
        .toArray();
    } 
    else 
    {

      totalItem = await metadataCollection.countDocuments(query);
      metadata = await metadataCollection
        .find(query,{ projection: { _id: false } } )
        .toArray();

      imageNames = metadata.map((item: ImageDetailsResponse) => item.image);

      thumbnails = await thumbCollection
        .find({ image: { $in: imageNames } }, { projection: { _id: false } })
        .skip(skip)
        .limit(limit)
        .toArray();
        
    }

    const jsonResponse = {
      page: page,
      per_page: limit,
      total_items: totalItem,
      total_pages: Math.ceil(totalItem / limit),
      thumbnails: thumbnails,
  };

  return NextResponse.json(jsonResponse, { status: 200 });
   
    
  } catch (error) {
    return NextResponse.json(`Failed to fetch images: ${error}`, { status: 200 });
  }
};

export const dynamic = 'force-dynamic';
