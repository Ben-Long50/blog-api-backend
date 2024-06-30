import { v2 as cloudinary } from 'cloudinary';

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dm4tmla72',
  api_key: process.env.API_KEY || '158547294753538',
  api_secret: process.env.API_SECRET || 'n6NdX8ShPogZ0_z5KyS4dfCSeq8',
  secure: true,
});

export default cloudinary;
