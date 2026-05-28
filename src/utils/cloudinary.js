import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image file
    const uploadOnCloudinary = async (localFilePath) => {
       try{
              if(!localFilePath) return null
              //upload the file path
               await cloudinary.uploader.upload(localFilePath,
                {
                    resource_type: 'auto',
                }
               )
               console.log('File uploaded to Cloudinary successfully',response.url);
               return response
       }
       catch(error){
        fs.unlinkSync(localFilePath)
        return null
       }
    }
})();