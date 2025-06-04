// import {getUserFromToken} from '@/lib/auth';
// import { dbConnect } from '@/lib/dbconnect';
// import Suggestion from '@/Models/Suggestion';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET() {
//   await dbConnect();
//   const suggestions = await Suggestion.find().populate('user', 'email role');
//   return NextResponse.json(suggestions);
// }

// export async function POST(req: NextRequest) {
//   await dbConnect();
//   const user = getUserFromToken(req);
//   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//   const { message } = await req.json();
//   const existing = await Suggestion.findOne({ user: user.userId });

//   if (existing) {
//     existing.message = message;
//     await existing.save();
//     return NextResponse.json(existing);
//   }

//   const newSuggestion = await Suggestion.create({
//     user: user.userId,
//     message,
//   });

//   return NextResponse.json(newSuggestion);
// }

// export async function PATCH(req: NextRequest) {
//   await dbConnect();
//   const user = getUserFromToken(req);
//   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//   const { id, action } = await req.json();
//   const suggestion = await Suggestion.findById(id);
//   if (!suggestion) return NextResponse.json({ error: 'Not found' }, { status: 404 });

//   if (action === 'like') {
//     if (!suggestion.likes.includes(user.email)) {
//       suggestion.likes.push(user.email);
//       suggestion.dislikes = suggestion.dislikes.filter((e:string) => e !== user.email);
//     }
//   } else if (action === 'dislike') {
//     if (!suggestion.dislikes.includes(user.email)) {
//       suggestion.dislikes.push(user.email);
//       suggestion.likes = suggestion.likes.filter((e:string) => e !== user.email);
//     }
//   }

//   await suggestion.save();
//   return NextResponse.json(suggestion);
// }



import {getUserFromToken} from '@/lib/auth';
import { dbConnect } from '@/lib/dbconnect';
import Suggestion from '@/Models/Suggestion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const suggestions = await Suggestion.find().populate('user', 'email role profileImage name');
    console.log("usgge === = == = = = = ", suggestions);
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('GET /api/suggestions error:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromToken(req);
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if user already has a suggestion
    const existing = await Suggestion.findOne({ user: user.userId });

    if (existing) {
      existing.message = message.trim();
      await existing.save();
      const populated = await Suggestion.findById(existing._id).populate('user', 'email role');
      return NextResponse.json(populated);
    }

    // Create new suggestion
    const newSuggestion = await Suggestion.create({
      user: user.userId,
      message: message.trim(),
    });

    const populated = await Suggestion.findById(newSuggestion._id).populate('user', 'email role');
    return NextResponse.json(populated);

  } catch (error) {
    console.error('POST /api/suggestions error:', error);
    return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 });
  }
}

// Add PUT method to match frontend expectations
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromToken(req);
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Find user's existing suggestion
    const existing = await Suggestion.findOne({ user: user.userId });
    if (!existing) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }

    existing.message = message.trim();
    await existing.save();
    
    const populated = await Suggestion.findById(existing._id).populate('user', 'email role profileImage name');
    return NextResponse.json(populated);

  } catch (error) {
    console.error('PUT /api/suggestions error:', error);
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromToken(req);
    if (!user || (!user.userId && !user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'ID and action are required' }, { status: 400 });
    }

    if (!['like', 'dislike'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }

    // Ensure likes and dislikes arrays exist
    if (!suggestion.likes) suggestion.likes = [];
    if (!suggestion.dislikes) suggestion.dislikes = [];

    const userEmail = user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    if (action === 'like') {
      if (!suggestion.likes.includes(userEmail)) {
        suggestion.likes.push(userEmail);
        suggestion.dislikes = suggestion.dislikes.filter((e: string) => e !== userEmail);
      }
    } else if (action === 'dislike') {
      if (!suggestion.dislikes.includes(userEmail)) {
        suggestion.dislikes.push(userEmail);
        suggestion.likes = suggestion.likes.filter((e: string) => e !== userEmail);
      }
    }

    await suggestion.save();
    const populated = await Suggestion.findById(suggestion._id).populate('user', 'email role profileImage name');
    return NextResponse.json(populated);

  } catch (error) {
    console.error('PATCH /api/suggestions error:', error);
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 });
  }
}