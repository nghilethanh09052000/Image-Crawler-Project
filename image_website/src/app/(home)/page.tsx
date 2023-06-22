import ImageCardWrapper from '@/components/ImageCard/ImageCard'
import Pagination from '@/components/Pagination/Pagination'
import { FilterProps } from "@/types";
import api from '@/utils/api';


export interface HomeProps {
  searchParams: FilterProps;
}



export default async function Home({searchParams}: HomeProps) {

  const {page} = searchParams

  const data = await api.getImageThumbs({
    page: page 
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
