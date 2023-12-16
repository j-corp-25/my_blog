require('dotenv').config({ path: __dirname + '/../.env' });
const cloudinary = require('cloudinary');

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const image = '/image.jpeg'; 

cloudinary.uploader.upload(image)
    .then(result => console.log('Upload successful:', result))
    .catch(err => console.error('Error uploading:', err));
