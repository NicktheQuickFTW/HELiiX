import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl:
        process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    };

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Test database connection
    const { data: testQuery, error: dbError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    // Check if tables exist
    const tableCheck = { user_profiles: false, auth_users: false };
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      tableCheck.user_profiles = !profileError;
    } catch (e) {
      // Table doesn't exist
    }

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        connected: !dbError,
        error: dbError?.message,
        tables: tableCheck,
      },
      auth: {
        hasSession: !!session,
        sessionError: sessionError?.message,
        user: session?.user?.email,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.status,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user?.email,
      session: !!data.session,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
