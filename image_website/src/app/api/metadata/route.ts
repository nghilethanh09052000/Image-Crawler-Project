import { connectMongoDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

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
    const collection = db.collection('Metadata');

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

    if (orderBy === 'views') {
      sortOptions['stat.views'] = -1;
    } else if (orderBy === 'likes') {
      sortOptions['stat.likes'] = -1;
    } else if (orderBy === 'comments') {
      sortOptions['stat.comments'] = -1;
    }

    const totalItem = await collection.countDocuments(query);
    const totalPage = Math.ceil(totalItem / limit);

    const metadata = await collection
      .find(query, { projection: { _id: false } })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();

    const jsonResponse = {
      page: page,
      per_page: limit,
      total_page: totalPage,
      metadata: metadata,
    };

    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(`Failed to fetch all images, ${error}`, { status: 200 });
  }
};

export const dynamic = 'force-dynamic';
