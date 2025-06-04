import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { dbConnect } from '@/lib/dbconnect';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log("request ===",await req);
    const { otp } = await req.json();
    
    if (!otp) {
      return NextResponse.json(
        { success: false, message: 'OTP is required' },
        { status: 400 }
      );
    }
    
    // Get current user from token
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    console.log("currentUser ==" , currentUser);
    // Verify OTP
    if (currentUser.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }
    
    // Check if OTP has expired
    if (new Date() > new Date(currentUser.otpExpiry)) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired' },
        { status: 400 }
      );
    }
    
    // Update user as verified
    currentUser.isVerified = true;
    currentUser.otp = '';
    await currentUser.save();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Account verified successfully',
        user: {
          id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          profileImage: currentUser.profileImage,
          isVerified: currentUser.isVerified,
        },
      },
      { status: 200 }
    );
  } 
  catch (error: unknown) { // Change 'any' to 'unknown'
  console.error('OTP verification error:', error);

  // Safely check if the error is an instance of Error to access its message
  let errorMessage = 'An unknown error occurred during verify otp.';
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
