import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse form data
    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    const folder = formData.get('folder') as string || 'uploads';
    
    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Image is required' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Cloudinary
    const imageUrl = await uploadImage(buffer, folder);
    
    return NextResponse.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        url: imageUrl,
      },
      { status: 200 }
    );
  } 
  catch (error: unknown) { // Change 'any' to 'unknown'
  console.error('Upload error:', error);

  // Safely check if the error is an instance of Error to access its message
  let errorMessage = 'An unknown error occurred during upload image.';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    // If the error is a string (less common, but possible in some contexts)
    errorMessage = error;
  }
  // You could add more specific checks for other error types if needed

  return NextResponse.json(
    { success: false, message: errorMessage }, // Use the safely determined errorMessage
    { status: 500 }
  );
}
}
