// app/dashboard/page.tsx
import { LinkEditor } from '@/components/LinkEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db/db';
import { links } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100">
        <p className="text-gray-600">Please sign in to view your links</p>
      </div>
    );
  }

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link
            href="/tree"
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            View Public Page
          </Link>
        </div>

        {/* Links Section */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Your Links</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add New Link Section */}
            <div className="mt-6">
              <LinkEditor initialLinks={[...userLinks]} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
