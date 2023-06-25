import ImageCardWrapper from '@/components/ImageCard/ImageCard'
import PaginationWrapper from '@/components/PaginationWrapper/PaginationWrapper'
import FilterBar from '@/components/FilterBar/FilterBar';

import { FilterProps } from "@/types";
import _ from 'lodash'
import api from '@/utils/api';


export interface HomeProps {
  searchParams: FilterProps;
}



export default async function Home({searchParams}: HomeProps) {

  const {
    page = 1,
    title,
    tag,
    exifMake,
    exifModel,
    orderBy,
    startDate,
    endDate
  } = searchParams


  const data = await api.getImageThumbs({
    page: page,
    title: title,
    tag: tag,
    exifMake: exifMake,
    exifModel: exifModel,
    orderBy: orderBy,
    startDate: startDate,
    endDate: endDate
  })

  const {
    thumbnails,
    total_items,
    total_pages
  } = data

  const getTags = await api.getImageTag();
  const getExifMake = await api.getExifMake()
  const getExifModel = await api.getExifModel()

  const { tagsList } = getTags
  const { makeGroups } = getExifMake
  const { modelGroups } = getExifModel


  

  return (
    <main className='overflow-hidden'>

    <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">

      <FilterBar
        tagsList={tagsList}
        makeGroups={makeGroups}
        modelGroups={modelGroups}
        tag={tag || ''}
        orderBy={orderBy || ''}
        startDate={startDate || ''}
        endDate={endDate || ''}
        exifMake={exifMake || ''}
        exifModel={exifModel || ''}
      />



      <ImageCardWrapper  
          thumbnails={thumbnails || []}
        />
        
      <PaginationWrapper
        page={+page || 1}
        totalPages={total_pages}
        totalItems={total_items}
      />  

    </div>
</main>
  )
}
