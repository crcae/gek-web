import { prisma } from '@/lib/db';

/**
 * Ensures an admin email exists in Supabase's `auth.users` and `auth.identities`
 * pre-confirmed so signInWithOtp never fails with "user not found" or "signups not allowed".
 */
export async function syncUserToSupabaseAuth(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const existingUsers = await prisma.$queryRawUnsafe<any[]>(
      'SELECT id, email_confirmed_at FROM auth.users WHERE lower(email) = lower($1) LIMIT 1',
      normalizedEmail
    );

    let userId: string;

    if (!existingUsers || existingUsers.length === 0) {
      const inserted = await prisma.$queryRawUnsafe<any[]>(`
        INSERT INTO auth.users (
          id,
          instance_id,
          aud,
          role,
          email,
          encrypted_password,
          email_confirmed_at,
          confirmation_token,
          recovery_token,
          email_change_token_new,
          email_change,
          raw_app_meta_data,
          raw_user_meta_data,
          created_at,
          updated_at
        ) VALUES (
          gen_random_uuid(),
          '00000000-0000-0000-0000-000000000000',
          'authenticated',
          'authenticated',
          $1,
          '$2a$10$LcdqU8OyTtEWYtNmCYtSR..lwCBQbLyUibA3RdG5Ee6ShPFGVkamy',
          NOW(),
          '',
          '',
          '',
          '',
          '{"provider":"email","providers":["email"]}'::jsonb,
          json_build_object('email', $1, 'email_verified', true),
          NOW(),
          NOW()
        )
        RETURNING id;
      `, normalizedEmail);
      userId = inserted[0]?.id;
    } else {
      userId = existingUsers[0].id;
      await prisma.$executeRawUnsafe(`
        UPDATE auth.users
        SET 
          email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
          encrypted_password = CASE WHEN encrypted_password = '' THEN '$2a$10$LcdqU8OyTtEWYtNmCYtSR..lwCBQbLyUibA3RdG5Ee6ShPFGVkamy' ELSE encrypted_password END,
          confirmation_token = COALESCE(confirmation_token, ''),
          recovery_token = COALESCE(recovery_token, ''),
          email_change_token_new = COALESCE(email_change_token_new, ''),
          email_change = COALESCE(email_change, '')
        WHERE id = $1::uuid;
      `, userId);
    }

    if (userId) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          provider_id,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          gen_random_uuid(),
          $1::uuid,
          json_build_object('sub', $1, 'email', $2, 'email_verified', true),
          'email',
          $1,
          NOW(),
          NOW(),
          NOW()
        ) ON CONFLICT (provider_id, provider) DO NOTHING;
      `, userId, normalizedEmail);
    }
  } catch (err: any) {
    console.warn('[SupabaseAuthSync] Warning syncing user to auth.users:', err?.message || err);
  }
}
