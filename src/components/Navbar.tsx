import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from './ui/button';

export function NavBar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          LinkTree Clone
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <UserButton signOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
