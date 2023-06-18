import express, { Router } from "express";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
import config from "../config/firebase.config"
import path from "path";
import fs from 'fs'


const router: Router = express.Router();

//Initialize a firebase application
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single('file'), async (req, res) => {
    try 
    {
        const {root_class, file} = req.body
        
        const originalName = file[0]
        const fileBuffer = Buffer.from(file[1], 'base64' )
        const mimetype = file[2]


        const storageRef = ref(storage, `${root_class}/${originalName}`);
        // Create file metadata including the content type
        const metadata = {
            contentType: mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, fileBuffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Get the image name
        const imageName = originalName.split('.')[0]

        // Grab the public url
        const thumbnail_url = await getDownloadURL(snapshot.ref);
        
        console.log('File successfully uploaded');
        return res.json({
            image: imageName,
            thumbnail_url: thumbnail_url
        })

    } 
    catch (error) 
    {
        return res.status(400).send(error.message)
    }
});

export default router;