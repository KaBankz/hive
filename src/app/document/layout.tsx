import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export default async function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>{children}</div>;
}
