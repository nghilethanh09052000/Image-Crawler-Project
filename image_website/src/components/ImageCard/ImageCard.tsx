"use client"


import Image from "next/image";
import { useState, useEffect } from "react";
import { getImageDetails } from "@/utils/utils";
import ModalDialog from "../ModalDialog/ModalDialog";
import CircleLoading from "../CircleLoading/CircleLoading";

interface Thumbnail {
  root_class: string;
  image: string;
  thumbnail_url: string;
}

interface GalleryProps {
  thumbnails: Thumbnail[];
}

const ImageCardWrapper = ({ thumbnails }: GalleryProps) => {

  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSeletedImage] = useState('')
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [imageDetails, setImageDetails] = useState(null);

  const handleImageClick = async (imageName: string, imageUrl: string) => {

    setIsLoading(true)

    updateURL(imageName);

    const imageDetail = await getImageDetails(imageName);

    if (imageDetail) {
      
    setImageDetails(imageDetail);

    setSeletedImage(imageUrl)

    openModal(imageName);
    setIsLoading(false)
    
    }

  };

  useEffect(() => {
    if (window.location.pathname !== "/") {
      const imageName = window.location.pathname.split("/images/")[1];
      fetchImageDetails(imageName);
      openModal(imageName);
    }
  }, []);

  const fetchImageDetails = async (imageName: string) => {
    try {
      const imageDetail = await getImageDetails(imageName);
      setImageDetails(imageDetail);
    } catch (error) {
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
      { isLoading && <CircleLoading/> }
      {
        isDialogOpen && 
          <ModalDialog 
            selectedImage={selectedImage} 
            imageDetails={imageDetails} 
            isDialogOpen={isDialogOpen} 
            closeModal={closeModal} 
          />
      }
    </div>
  );
};

export default ImageCardWrapper;
