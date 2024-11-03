'use client';

import { FadeInAnimation } from '@/components/animations/FadeInAnimation';
import { GsapReveal } from '@/components/animations/GsapReveal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <FadeInAnimation>
        <h1 className="text-6xl font-bold text-center mb-6">
          Your Links, Your Brand
        </h1>
      </FadeInAnimation>

      <FadeInAnimation delay={0.2}>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl">
          Create a beautiful landing page to share all your important links in
          one place. Customize your page, track clicks, and grow your audience.
        </p>
      </FadeInAnimation>

      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {isSignedIn ? (
          <Button size="lg" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <>
            <Button size="lg" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </>
        )}
      </motion.div>

      <GsapReveal>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Easy to Use"
            description="Create and manage your links with our intuitive dashboard"
          />
          <FeatureCard
            title="Custom Themes"
            description="Make your page unique with custom colors and styles"
          />
          <FeatureCard
            title="Analytics"
            description="Track clicks and understand your audience"
          />
        </div>
      </GsapReveal>
    </main>
  );
}

const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
