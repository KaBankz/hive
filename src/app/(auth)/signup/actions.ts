'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/utils/supabase/server';

type SignupState = {
  confirmationSent: boolean;
  error: string;
};

export async function signup(prevState: SignupState, formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      error: error.message,
      confirmationSent: false,
    };
  }

  revalidatePath('/', 'layout');
  return { confirmationSent: true, error: '' };
}
