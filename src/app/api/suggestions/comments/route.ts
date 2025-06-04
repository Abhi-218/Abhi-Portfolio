import { getUserFromToken } from '@/lib/auth';
import { dbConnect } from '@/lib/dbconnect';
import Suggestion from '@/Models/Suggestion';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = getUserFromToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, text } = await req.json();
  const suggestion = await Suggestion.findById(id);
  if (!suggestion) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  suggestion.comments.push({
    email: user.email,
    text,
    createdAt: new Date(),
  });

  await suggestion.save();
  return NextResponse.json(suggestion);
}
