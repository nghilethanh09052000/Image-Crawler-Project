import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';

interface ModalDialogProps {
  isDialogOpen: boolean;
  closeModal: () => void;
  title: string;
  children: React.ReactNode; // Add children prop
}

const ModalDialog = ({ isDialogOpen, closeModal, title, children }: ModalDialogProps) => {



  useEffect(() => {
    if (!isDialogOpen) {
      const body = document.getElementsByTagName('body')[0];
      body.style.overflow = 'auto';
    }
  }, [isDialogOpen]);

  const handleCloseDialog = () => {
    closeModal()
  }
  

  return (
    <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog} 
        className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="mx-auto bg-black rounded">
              <Dialog.Title className="text-center capitalize">{title}</Dialog.Title>
              {children} 
            </Dialog.Panel>
          </div>
        </div>
    </Dialog>
  );
};

export default ModalDialog;
