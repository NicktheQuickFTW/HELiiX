import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { action, email, password } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    if (action === 'create-admin') {
      // Create admin user
      const { data: user, error } = await supabase.auth.admin.createUser({
        email: email || 'admin@big12sports.com',
        password: password || 'Conference12!',
        email_confirm: true,
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User',
          department: 'IT',
          role: 'admin',
        },
      });

      if (error) {
        if (error.message.includes('already been registered')) {
          // Try to get existing user
          const { data: users } = await supabase.auth.admin.listUsers();
          const existingUser = users?.users?.find((u) => u.email === email);

          return NextResponse.json({
            message: 'User already exists',
            user: existingUser?.email,
            id: existingUser?.id,
          });
        }
        throw error;
      }

      return NextResponse.json({
        message: 'Admin user created successfully',
        user: user.user?.email,
        id: user.user?.id,
        credentials: {
          email: email || 'admin@big12sports.com',
          password: password || 'Conference12!',
        },
      });
    }

    if (action === 'reset-password') {
      // Reset password for existing user
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users?.users?.find((u) => u.email === email);

      if (!user) {
        return NextResponse.json(
          {
            error: 'User not found',
          },
          { status: 404 }
        );
      }

      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: password || 'Conference12!',
      });

      if (error) throw error;

      return NextResponse.json({
        message: 'Password reset successfully',
        credentials: {
          email: email,
          password: password || 'Conference12!',
        },
      });
    }

    return NextResponse.json(
      {
        error: 'Invalid action',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
