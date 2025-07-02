// src/app/admin/logout/route.ts
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST() {
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  redirect('/admin');
}
