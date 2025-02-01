'use client';

import { useEffect } from 'react';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

import { createClient } from '@/utils/supabase/client';

import PostHogPageView from './PostHogPageView';

const isDev = process.env.NODE_ENV === 'development';

function PostHogAuthWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (isDev) return;
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        posthog.identify(session.user.id, { email: session.user.email });
      } else if (event === 'SIGNED_OUT') {
        posthog.capture('loggedOut');
        posthog.reset();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return children;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (isDev) return;

    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      throw new Error('NEXT_PUBLIC_POSTHOG_KEY is not set');
    }

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      // proxied with rewrites in next.config.ts
      api_host: '/api/v1/ingest',
      person_profiles: 'always',
      capture_pageview: false, // handled by PostHogPageView
      capture_pageleave: true,
    });
  }, []);

  if (isDev) return children;

  return (
    <PHProvider client={posthog}>
      <PostHogAuthWrapper>
        <PostHogPageView />
        {children}
      </PostHogAuthWrapper>
    </PHProvider>
  );
}
