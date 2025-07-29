'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Column,
  Row,
  Card,
  Button,
  Text,
  Heading,
  Badge,
} from '@once-ui-system/core';
import { useAuth } from '@/lib/auth-context';

export default function AuthDebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<
    'checking' | 'connected' | 'error'
  >('checking');
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { user, profile, session } = useAuth();

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      // Test Supabase connection
      const { data: healthCheck, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (error) {
        setConnectionStatus('error');
        setDebugInfo((prev) => ({ ...prev, connectionError: error.message }));
      } else {
        setConnectionStatus('connected');
      }

      // Check auth status
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      setAuthStatus({
        hasSession: !!session,
        sessionError: sessionError?.message,
        user: session?.user,
      });

      // Check for auth state
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setDebugInfo({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        connectionStatus: error ? 'error' : 'connected',
        connectionError: error?.message,
        authSession: !!session,
        authUser: !!currentUser,
        contextUser: !!user,
        contextProfile: !!profile,
        contextSession: !!session,
      });
    } catch (error) {
      setConnectionStatus('error');
      setDebugInfo((prev) => ({ ...prev, fatalError: error.message }));
    }
  };

  const testLogin = async () => {
    try {
      const testEmail = 'test@big12sports.com';
      const testPassword = 'TestPassword123!';

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        alert(`Login test failed: ${error.message}`);
      } else {
        alert('Login test successful!');
        checkSupabaseConnection();
      }
    } catch (error) {
      alert(`Test error: ${error.message}`);
    }
  };

  const createTestUser = async () => {
    try {
      const testEmail = `test.${Date.now()}@big12sports.com`;
      const testPassword = 'TestPassword123!';

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User',
            department: 'Testing',
          },
        },
      });

      if (error) {
        alert(`Create user failed: ${error.message}`);
      } else {
        alert(`Test user created: ${testEmail} / ${testPassword}`);
      }
    } catch (error) {
      alert(`Create error: ${error.message}`);
    }
  };

  return (
    <Column gap="24" padding="24" fillWidth>
      <Heading variant="heading-strong-xl">Authentication Debug Page</Heading>

      <Card padding="24" fillWidth>
        <Column gap="16">
          <Row gap="8" align="center">
            <Text variant="label">Supabase Connection:</Text>
            <Badge
              size="s"
              variant={
                connectionStatus === 'connected'
                  ? 'success'
                  : connectionStatus === 'error'
                    ? 'danger'
                    : 'neutral'
              }
            >
              {connectionStatus}
            </Badge>
          </Row>

          <Row gap="8" align="center">
            <Text variant="label">Auth Session:</Text>
            <Badge
              size="s"
              variant={authStatus?.hasSession ? 'success' : 'danger'}
            >
              {authStatus?.hasSession ? 'Active' : 'No Session'}
            </Badge>
          </Row>

          <Row gap="8" align="center">
            <Text variant="label">Context User:</Text>
            <Badge size="s" variant={user ? 'success' : 'danger'}>
              {user ? user.email : 'No User'}
            </Badge>
          </Row>
        </Column>
      </Card>

      <Card padding="24" fillWidth background="neutral-weak">
        <Column gap="16">
          <Heading variant="heading-strong-m">Debug Information</Heading>
          <pre
            style={{
              fontSize: '12px',
              overflowX: 'auto',
              backgroundColor: 'var(--neutral-900)',
              color: 'var(--neutral-100)',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </Column>
      </Card>

      <Card padding="24" fillWidth>
        <Column gap="16">
          <Heading variant="heading-strong-m">Test Actions</Heading>
          <Row gap="12">
            <Button
              onClick={checkSupabaseConnection}
              variant="secondary"
              size="m"
            >
              Refresh Status
            </Button>
            <Button onClick={createTestUser} variant="secondary" size="m">
              Create Test User
            </Button>
            <Button onClick={testLogin} variant="secondary" size="m">
              Test Login
            </Button>
          </Row>
        </Column>
      </Card>

      {authStatus?.sessionError && (
        <Card padding="24" fillWidth background="danger-weak">
          <Column gap="8">
            <Text variant="label" onBackground="danger">
              Session Error:
            </Text>
            <Text variant="body-default-s" onBackground="danger">
              {authStatus.sessionError}
            </Text>
          </Column>
        </Card>
      )}
    </Column>
  );
}
