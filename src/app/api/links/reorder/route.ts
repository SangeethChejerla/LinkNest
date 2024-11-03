import { db } from '@/db/db';
import { links } from '@/db/schema';
import { getAuth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { links: newOrder } = await req.json();

    // Validate that all links belong to the user
    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.userId, userId));

    const userLinkIds = new Set(userLinks.map((link) => link.id));
    const newOrderIds = new Set(newOrder.map((link) => link.id));

    if (!Array.from(newOrderIds).every((id) => userLinkIds.has(id))) {
      return new NextResponse('Invalid link IDs', { status: 400 });
    }

    // Update each link's order in a transaction
    await db.transaction(async (tx) => {
      for (const [index, link] of newOrder.entries()) {
        await tx
          .update(links)
          .set({ order: index })
          .where(eq(links.id, link.id));
      }
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error in PUT:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
