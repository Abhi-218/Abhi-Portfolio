import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import User, { IUser } from '@/Models/User';

if (!process.env.JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export interface UserJwtPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export function generateToken(user: IUser) {
  // Set token to expire in 30 days
  const expiresIn = 60 * 60 * 24 * 30; // 30 days in seconds
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn }
  );
}


export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function getAuthToken(req?: NextRequest) {
  // For API routes
  if (req) {
    const authHeader = req.headers.get('authorization');
    console.log("authHeader 💭💭💭", authHeader)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const tokenFromCookie = req.cookies.get('auth_token')?.value;
    console.log("token 💭💭💭", tokenFromCookie)
    if (tokenFromCookie) {
      return tokenFromCookie;
    }
  }
}


export function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}




export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserJwtPayload;
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCurrentUser(req?: NextRequest): Promise<IUser | null> {
  try {
    const token = await getAuthToken(req);
    if (!token) return null;

    const decoded = await verifyToken(token);
    if (!decoded) return null;

    console.log("decoded 💭💭💭", decoded);
    const user = await User.findById(decoded.userId);
    console.log("user 💭💭💭", user);
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function checkAuthStatus(req?: NextRequest): Promise<{
  authenticated: boolean;
  user: IUser | null;
  requiresNewLogin: boolean;
}> {
  const user = await getCurrentUser(req);

  if (!user) {
    return { authenticated: false, user: null, requiresNewLogin: true };
  }

  // Check if the user last logged in more than 30 days ago
  const lastLogin = new Date(user.lastLoginDate);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const requiresNewLogin = lastLogin < thirtyDaysAgo;

  return {
    authenticated: true,
    user,
    requiresNewLogin,
  };
}