import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, addDays } from '@/lib/utils';
import { generateToken} from '@/lib/auth';
import User from '@/Models/User';
import { dbConnect } from '@/lib/dbconnect';
import { uploadImage } from '@/lib/cloudinary';
import emailsender from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Parse the form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'admin' | 'user';
    const profileImage = formData.get('profileImage') as File | null;
    
    // Validate required fields
    if (!name || !email || !password || !profileImage) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Upload profile image to Cloudinary if provided
    let profileImageUrl = '';
    if (profileImage) {
      const arrayBuffer = await profileImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      profileImageUrl = await uploadImage(buffer);
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = addDays(new Date(), 1); // OTP valid for 1 day
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      profileImage: profileImageUrl,
      otp,
      otpExpiry,
      isVerified: false,
      lastLoginDate: new Date(),
    });
      console.log("otp  ===" , otp)
    // Send OTP via email
    await emailsender(email, otp , 'signup');
    
    // Generate JWT token
    const token = generateToken(user);

    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify with OTP.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
        },
      },
      { status: 201,
         headers: {
        'Authorization': `Bearer ${token}`, // Adding the Authorization header
         }
       }
    );
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } 
  catch (error: unknown) { // Change 'any' to 'unknown'
  console.error('Signup error:', error);

  // Safely check if the error is an instance of Error to access its message
  let errorMessage = 'An unknown error occurred during Sign up.';
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
