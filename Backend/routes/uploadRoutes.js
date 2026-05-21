const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'interior-design',
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'heic', 'heif', 'svg']
  }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', protect, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        try {
            if (err) {
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
            next(catchErr);
        }
    });
});

module.exports = router;
