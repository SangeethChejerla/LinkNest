'use client';

import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';

// Schema definition
const linkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
});

// Type definitions
type FormData = z.infer<typeof linkSchema>;

type Link = {
  id: number;
  title: string;
  url: string;
  order: number;
};

interface LinkEditorProps {
  initialLinks: Link[];
}

export function LinkEditor({ initialLinks }: LinkEditorProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: '',
      url: '',
    },
  });

  useEffect(() => {
    setLinks(initialLinks);
    setIsMounted(true);
  }, [initialLinks]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to add link');

      const newLink = await response.json();
      setLinks((prevLinks) => [...prevLinks, newLink]);
      reset();
      toast({
        title: 'Success',
        description: 'Link added successfully',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add link',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReorder = async (newOrder: Link[]) => {
    setLinks(newOrder);
    try {
      const response = await fetch('/api/links/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: newOrder }),
      });

      if (!response.ok) throw new Error('Failed to update link order');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update link order',
        variant: 'destructive',
      });
    }
  };

  const deleteLink = async (id: number) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to delete link');

      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
      toast({
        title: 'Success',
        description: 'Link deleted successfully',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive',
      });
    }
  };

  // Don't render until client-side mounted
  if (!isMounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            key="title-input"
            {...register('title')}
            placeholder="Link Title"
            className="mb-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Input
            key="url-input"
            {...register('url')}
            placeholder="URL (https://...)"
            className="mb-2"
          />
          {errors.url && (
            <p className="text-red-500 text-sm">{errors.url.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {isSubmitting ? 'Adding...' : 'Add Link'}
        </Button>
      </form>

      {links.length > 0 && (
        <Reorder.Group
          axis="y"
          values={links}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {links.map((link) => (
            <Reorder.Item key={link.id} value={link}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
              >
                <GripVertical className="cursor-move text-gray-400" />
                <div className="flex-1">
                  <h3 className="font-medium">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.url}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLink(link.id)}
                  className="hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
