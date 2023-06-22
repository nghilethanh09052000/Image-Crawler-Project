"use client"


import Image from "next/image";
import { useState, useContext } from "react";
import ImageDetails from "../ImageDetails/ImageDetails";
import api from "@/utils/api";
import { 
  Thumbnail,
  ImageDetailsResponse 
} from "@/types";

import { 
  AppContext, 
  setLoading 
} from "@/context/Context";
import ModalDialog from "../ModalDialog/ModalDialog";

interface GalleryProps {
  thumbnails: Thumbnail[];
}

const ImageCardWrapper = ({ thumbnails }: GalleryProps) => {

  const {dispatch} = useContext(AppContext)

  const [selectedImage, setSeletedImage] = useState('')
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [imageDetails, setImageDetails] = useState<ImageDetailsResponse | null>(null);

  const handleImageClick = async (imageName: string, imageUrl: string) => {
    
    setLoading(dispatch, true)

    const getImageDetails = await fetchImageDetails(imageName);
    
    if(!getImageDetails) return
    
    updateURL(imageName);
    setImageDetails(getImageDetails);
    setSeletedImage(imageUrl)
    openModal(imageName);


    setLoading(dispatch, false)

  };


  const fetchImageDetails = async (imageName: string) => {
    try 
    {
      const getImageDetails = await api.getImageDetails(imageName);
      return getImageDetails
    } 
    catch (error) 
    {
      console.error("Error fetching image details:", error);
    }
  };

  const updateURL = (imageName: string) => {
    const currentURL = window.location.href;
    const imagesSegment = "images/";
    const regex = new RegExp(`${imagesSegment}[^/]*`);
  
    if (regex.test(currentURL)) {
      const newURL = currentURL.replace(regex, `${imagesSegment}${imageName}`);
      window.history.replaceState({ path: newURL }, "", newURL);
    } else {
      const newURL = `${currentURL}${imagesSegment}${imageName}`;
      window.history.replaceState({ path: newURL }, "", newURL);
    }
  };

  const openModal = (imageName: string) => {
    setDialogOpen(true);
    document.title = imageName;
  };

  const closeModal = () => {
    document.title = "Images Gallery";
    setDialogOpen(false);
    window.history.replaceState({ path: '/' }, '', '/');
  };

 

  return (  
    <div className="-m-1 flex flex-wrap md:-m-2">
      {thumbnails.map((thumbnail) => (
        <div className="flex lg:basis-1/4 sm:basis-1/2 flex-wrap" key={thumbnail.image}>
          <div className="w-full p-1 md:p-2">
            <Image
              alt={thumbnail.image}
              className="block cursor-pointer h-full w-full rounded-lg object-cover object-center"
              src={thumbnail.thumbnail_url}
              width={244}
              height={244}
              onClick={() => handleImageClick(thumbnail.image, thumbnail.thumbnail_url)}
            />
          </div>
        </div>
      ))}
      {
        isDialogOpen 
        && imageDetails
        && (
          <ModalDialog
            isDialogOpen={isDialogOpen} 
            closeModal={closeModal} 
            title={imageDetails.image}
          >
              <ImageDetails 
              selectedImage={selectedImage} 
              imageDetails={imageDetails} 
            />
          </ModalDialog>
        )
         
      }
    </div>
  );
};

export default ImageCardWrapper;
