"use client";

import Image from "next/image";
import _ from 'lodash'
interface ImageDetailsProps {
  selectedImage: string;
  imageDetails: any;
}
import { capitalizeFirstLetter } from "@/utils/utils";


const ImageDetails = ({
  selectedImage,
  imageDetails,
}: ImageDetailsProps) => {

  return (
   
      <div className="flex items-center justify-center p-4">
        <div>
            <div className="w-full pb-3 bg-black">

                <div className="px-5 py-3">

                    <div className="lg:flex lg:justify-between items-center justify-center mb-3 ">
                        <div className="rounded lg:block flex items-center justify-center mb-3">
                            <Image
                                src={selectedImage}
                                alt={selectedImage}
                                className="cursor-pointer lg:h-full lg:w-full rounded-lg object-cover object-center"
                                loading="lazy"
                                sizes=""
                                width={244}
                                height={244}
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-white font-serif sm:mt-7 lg:ml-5">
                                <div className="mx-auto w-6/12">
                                <h2 className="font-serif text-center lg:text-xl sm:text-base mb-5">
                                    {imageDetails.title}
                                </h2>
                                </div>
                                <p className="font-sans text-center">
                                Published on {imageDetails.uploaded}
                                </p>
                                <p className="font-sans mt-3 text-sm text-center underline">
                                Owner: {imageDetails.owner}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-2 gap-4">

                            {
                                _.map(Object.keys(imageDetails.stat), data => {
                                    return imageDetails.stat[data] && (
                                        <div className="grid grid-rows-2 text-white" key={data}>
                                            <p className="leading-none text-sm">{capitalizeFirstLetter(data)}</p>
                                            <p className="text-md font-bold">{imageDetails.stat[data]}</p>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>

                </div>
            </div>

            <div className="w-full pb-3 bg-white">
                <div className="px-5 py-3">
                    <div className="grid lg:grid-cols-3 lg:gap-3 grid-cols-2">

                        {
                            _.map(Object.keys(imageDetails.exif),data => {
                                return imageDetails.exif[data] && (
                                    <div className="lg:grid lg:grid-rows-2" key={data}>
                                        <p className="leading-none text-slate-800 text-sm">{capitalizeFirstLetter(data)}</p>
                                        <p className="text-md font-semibold">{imageDetails.exif[data]}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
      </div>
  );
};

export default ImageDetails;
