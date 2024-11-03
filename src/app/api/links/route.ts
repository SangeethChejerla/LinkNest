import { db } from '@/db/db';
import { links } from '@/db/schema';
import { getAuth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, url } = await req.json();
    const newLink = await db
      .insert(links)
      .values({
        userId,
        title,
        url,
      })
      .returning();

    return NextResponse.json(newLink[0]);
  } catch (error) {
    console.error('Error in POST:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(links.order);

    return NextResponse.json(userLinks);
  } catch (error) {
    console.error('Error in GET:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
