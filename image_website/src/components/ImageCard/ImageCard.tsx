'use client'
import Image from "next/image";
import _ from 'lodash'

interface Thumbnail {
    root_class: string;
    image: string;
    thumbnail_url: string;
  }
  

interface GalleryProps {
    thumbnails: Thumbnail[];
  }
  

const ImageCardWrapper = async ({thumbnails}: GalleryProps) => {
    
    
    return (
        <div className="-m-1 flex flex-wrap md:-m-2">
        {
            _.map(thumbnails, thumbnail => (
                <div className="flex lg:basis-1/4 sm:basis-1/2 flex-wrap" key={thumbnail.image}>
                    <div className="w-full p-1 md:p-2">
                        <Image
                            alt={thumbnail.image}
                            className="block h-full w-full rounded-lg object-cover object-center"
                            src={thumbnail.thumbnail_url}
                            width={244}
                            height={244}
                        />
                    </div>
              </div>
            ))
        }
        </div>       
  )
}

export default ImageCardWrapper;
