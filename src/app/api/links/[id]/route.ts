import { db } from '@/db/db';
import { links } from '@/db/schema';
import { getAuth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Ensure the id is properly parsed to a number if it's supposed to be numeric
    const linkId = parseInt(params.id, 10);

    // Check if the parsed id is valid
    if (isNaN(linkId)) {
      return new NextResponse('Invalid link ID', { status: 400 });
    }

    await db
      .delete(links)
      .where(and(eq(links.id, linkId), eq(links.userId, userId)));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
