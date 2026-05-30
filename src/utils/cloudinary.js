import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image file
    const uploadOnCloudinary = async (localFilePath) => {
       if(!localFilePath) return null;
       let response = null;
       try {
           response = await cloudinary.uploader.upload(localFilePath, {
               resource_type: 'auto',
           });
           console.log('File uploaded to Cloudinary successfully', response.url);
           return response;
       } catch (error) {
           console.error('Cloudinary upload failed:', error);
           return null;
       } finally {
           try {
               fs.rmSync(localFilePath, { force: true });
           } catch (unlinkError) {
               console.error('Failed to remove temp file:', unlinkError);
           }
       }
    }
 export {uploadOnCloudinary};