import { NextResponse } from 'next/server';

export async function POST() {
  // Legacy chat has been replaced by Guided AI
  return NextResponse.json(
    { error: 'Legacy chat has been replaced by Guided AI.' }, 
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: 'Legacy chat has been replaced by Guided AI.' }, 
    { status: 410 }
  );
}
