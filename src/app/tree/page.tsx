// app/tree/page.tsx
import { db } from '@/db/db';
import { links } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function TreePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100">
        <p className="text-gray-600">Please sign in to view your links</p>
      </div>
    );
  }
  const user = await currentUser();
  if (!user) return <p>No Image URL found</p>;
  const { imageUrl, firstName, lastName } = user;
  const params = new URLSearchParams();
  const userName = `${firstName || ''} ${lastName || ''}`.trim();

  params.set('height', '200');
  params.set('width', '200');
  params.set('quality', '100');
  params.set('fit', 'crop');

  const imageSrc = `${imageUrl}?${params.toString()}`;

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-white">
              <img src={imageSrc} alt="User image" className="rounded-full" />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            @{userName || 'Not Provided'}
          </h1>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {userLinks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No links available</p>
            </div>
          ) : (
            userLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center transform hover:-translate-y-1"
              >
                <span className="text-gray-800 font-medium">
                  {link.title || link.url}
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Made with 💜</p>
        </footer>
      </div>
    </div>
  );
}
