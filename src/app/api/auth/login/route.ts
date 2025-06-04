import { NextRequest, NextResponse } from 'next/server';
import { generateToken} from '@/lib/auth';
import { dbConnect } from '@/lib/dbconnect';
import User from '@/Models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login date
    user.lastLoginDate = new Date();
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user);
    const response= NextResponse.json(
      {
        success: true,
        message: 'Login successful',
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
  } catch (error: unknown) { // Change 'any' to 'unknown'
  console.error('Login error:', error);

  // Safely check if the error is an instance of Error to access its message
  let errorMessage = 'An unknown error occurred during login.';
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