import { FilterProps } from "@/types";
import ImageCardWrapper from '@/components/ImageCard/ImageCard'
import Pagination from '@/components/Pagination/Pagination'
import api from "@/utils/api";
import Image from "next/image";



export interface ImageSearchPageProps {
  searchParams: FilterProps;
}

export default async function Page({ searchParams }: ImageSearchPageProps) {
    
    const {page, title, tag, orderBy, startDate, endDate} = searchParams

    const data = await api.getImageThumbs({
      page: page ,
      title: title ,
      tag : tag ,
      orderBy : orderBy,
      startDate : startDate ,
      endDate : endDate ,
    })

    const {
      thumbnails,
      total_items,
      per_page, 
      total_pages
    } = data


    return (
      <main className='overflow-hidden'>

          <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">

          <ImageCardWrapper  
              thumbnails={thumbnails || []}
            />

            <Pagination
              page={page || 1}
              totalPages={total_pages}
              totalItems={total_items}
              perPage={per_page}
              isNext={thumbnails.length > 0}
            />

          </div>
      </main>
    )
}
