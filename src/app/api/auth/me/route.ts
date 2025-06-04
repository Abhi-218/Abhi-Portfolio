import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { dbConnect } from '@/lib/dbconnect';

export async function GET(req: NextRequest) {
  try {
    dbConnect();
    const user = await getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  }
  catch (error: unknown) { // Change 'any' to 'unknown'
  console.error('me error:', error);

  // Safely check if the error is an instance of Error to access its message
  let errorMessage = 'An unknown error occurred during api/me.';
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