'use client';

import { useRef, useEffect } from 'react'
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import CircleLoading from '../CircleLoading/CircleLoading';


interface ModalDialogProps {
    selectedImage: string;
    imageDetails: any;
    isDialogOpen: boolean;
    closeModal: () => void;
}


const ModalDialog = ({selectedImage, imageDetails, isDialogOpen , closeModal}:ModalDialogProps) => {

    useEffect(() => {
        if (!isDialogOpen) {
          const body = document.getElementsByTagName('body')[0];
          body.style.overflow = 'auto';
        }
      }, [isDialogOpen]);

    const handleDialogClose = () => {
        closeModal();
    };

    return (
        <Dialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          className="relative z-50 w-6/12"
        >
          <div className="fixed inset-0 bg-black/30 overflow-y-auto" aria-hidden="true" />
    
            <div className="fixed inset-0 flex items-center justify-center p-4">
                {/* The actual dialog panel  */}
                <Dialog.Panel className="mx-auto lg:w-2/5 sm:w-4/5 rounded bg-white">

                <Dialog.Title>
                    <h1 className='text-center'>
                        {imageDetails.image}
                    </h1>
                </Dialog.Title>

                <div className='w-full pb-3 bg-black'>
                    <div className='px-5 py-3'>
                        <div className='lg:flex mb-3 items-center lg:space-between'>

                            <div className='rounded sm:flex items-center'>
                                <Image
                                    src={selectedImage}
                                    alt={selectedImage}
                                    className="block cursor-pointer lg:h-full lg:w-full sm:h-3/6 sm:w-3/6 rounded-lg object-cover object-center"
                                    loading='lazy'
                                    sizes=''
                                    width={244}
                                    height={244}
                                />
                            </div>

                            <div className='text-white font-serif sm:mt-10 lg:ml-5'>

                                <h2 className='font-serif text-center lg:text-xl sm:text-base mb-5'>
                                    {imageDetails.title}
                                </h2>

                                <p className='font-sans text-center'>
                                    Published on {imageDetails.uploaded}
                                </p>
                            </div>
                       
                        </div>
                        <div className='mt-10 lg:flex'>

                            <div className='text-white grid grid-rows-2 grid-cols-2 gap-4 font-sans'>
                                <p>Views: {imageDetails.stat.views}</p>
                                <p className='lg:ml-10'>Likes: {imageDetails.stat.likes}</p>
                                <p className='lg:ml-5'>Downloads: {imageDetails.stat.downloads}</p>
                                <p className='lg:ml-20'>Comments: {imageDetails.stat.comments || ''}</p>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='w-full pb-3 bg-white'>
                    <div className='px-5 py-3'>
                    <div className='text-black grid grid-rows-4 grid-flow-col gap-4 font-sans'>
                        <p>Makes: {imageDetails.exif.makes}</p>
                        <p>Model: {imageDetails.exif.model}</p>
                        <p>Shutterspeed: {imageDetails.exif.shutterspeed}</p>
                        <p>Fstop: {imageDetails.exif.fstop}</p>
                        <p>Iso: {imageDetails.exif.iso}</p>
                        <p>Focal Length: {imageDetails.exif.focallength}</p>
                        <p>Lens: {imageDetails.exif.lens}</p>
                    </div>
                    </div>
                </div>
        
                
                </Dialog.Panel>
            </div>
        </Dialog>
      )
}
 
export default ModalDialog;