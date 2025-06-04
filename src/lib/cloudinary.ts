import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imageBuffer: Buffer, folderName: string = 'profiles'): Promise<string> {
  try {
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folderName,
      resource_type: 'image',
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}