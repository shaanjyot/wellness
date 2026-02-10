'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getPageContent, PageContent } from '@/lib/cms';

export function usePageContent(slug: string) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 1. Initial Fetch
  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await getPageContent(slug);
        if (isMounted) {
          if (data) {
            setContent(data);
            setPageId(data.id);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error(`Error fetching page [${slug}]:`, err);
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // 2. Real-time Subscription (only when we have pageId)
  useEffect(() => {
    if (!pageId) return;

    const channel = supabase
      .channel(`cms-${slug}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'page_sections',
          filter: `page_id=eq.${pageId}`
        },
        (payload) => {
          // payload.new contains the new record
          const newRecord = payload.new as any;
          const eventType = payload.eventType;

          console.log(`Real-time update [${eventType}] for page ${slug}:`, newRecord);

          setContent((prevContent) => {
            if (!prevContent) return null;

            // Clone sections map
            const newSections = { ...prevContent.sections };

            if (eventType === 'DELETE') {
              // We may not know which key was deleted from payload.old unless replica identity is full
              // Simplest is to refetch entire content, or just ignore if we assume CMS only updates content
              // But let's try to update if we can match key.
              // Without key in 'old', we can't delete from map efficiently.
              // For robustness, let's trigger a refetch or ignore DELETE for now (since CMS mainly updates).
              // If we really need DELETE handling, we'd refetch.
              return prevContent;
            } else if (newRecord.section_key) {
              // UPDATE or INSERT with content
              newSections[newRecord.section_key] = newRecord.content;
            }

            return {
              ...prevContent,
              sections: newSections
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pageId, slug]);

  return { content, loading, error };
}
