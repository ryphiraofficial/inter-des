import express from 'express';
import multer from 'multer';
import path from 'path';
import {  protect  } from '../../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import {  CloudinaryStorage  } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Warn loudly at startup if Cloudinary credentials are missing
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('[uploadRoutes] ⚠️  CLOUDINARY credentials are missing from environment variables!');
  console.error('[uploadRoutes]    Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check if the file is an image
    const isImage = file.mimetype.startsWith('image/') || file.originalname.match(/\.(jpeg|jpg|png|webp|gif|heic|heif|svg)$/i);
    // Check if the file is a video
    const isVideo = file.mimetype.startsWith('video/') || file.originalname.match(/\.(mp4|mov|avi|wmv|mkv|webm)$/i);
    
    if (isImage) {
        return {
            folder: 'interior-design',
            allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'heic', 'heif', 'svg'],
            resource_type: 'image'
        };
    } else if (isVideo) {
        return {
            folder: 'interior-design',
            resource_type: 'video'
        };
    } else {
        // For PDFs, DOCs, ZIPs, etc., use 'raw' so Cloudinary doesn't process them as images
        return {
            folder: 'interior-design',
            resource_type: 'raw'
        };
    }
  }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', protect, (req, res, next) => {
    // Guard: reject immediately if credentials not configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'Server configuration error: Cloudinary credentials not set. Contact administrator.'
        });
    }

    upload.single('image')(req, res, (err) => {
        try {
            if (err) {
                console.error('[uploadRoutes] Multer/Cloudinary error:', err.message);
                return res.status(400).json({
                    success: false,
                    message: err.message || 'Error occurred during file upload'
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a file'
                });
            }

            // Cloudinary URL is stored in req.file.path
            return res.status(200).json({
                success: true,
                data: req.file.path,
                url: req.file.path
            });
        } catch (catchErr) {
            console.error('[uploadRoutes] Unexpected error:', catchErr);
            next(catchErr);
        }
    });
});

export default router;