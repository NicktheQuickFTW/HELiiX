'use client';

import { useState } from 'react';
import {
  Column,
  Row,
  Card,
  Button,
  Text,
  Heading,
  Badge,
  Input,
} from '@once-ui-system/core';
import { toast } from 'sonner';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('admin@big12sports.com');
  const [password, setPassword] = useState('Conference12!');
  const [result, setResult] = useState<any>(null);

  const createAdminUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-admin',
          email,
          password,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        toast.success(data.message || 'Admin user created successfully');
      } else {
        toast.error(data.error || 'Failed to create admin user');
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset-password',
          email,
          password,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        toast.success(data.message || 'Password reset successfully');
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Column gap="24" padding="24" fillWidth>
      <Card padding="24" fillWidth>
        <Column gap="24">
          <Column gap="8">
            <Heading variant="heading-strong-xl">HELiiX Setup</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Use this page to create an admin account or reset passwords
            </Text>
          </Column>

          <Column gap="16">
            <Column gap="8">
              <Text variant="label">Email</Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@big12sports.com"
              />
            </Column>

            <Column gap="8">
              <Text variant="label">Password</Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Conference12!"
              />
            </Column>
          </Column>

          <Row gap="12">
            <Button
              onClick={createAdminUser}
              disabled={isLoading}
              variant="primary"
              size="m"
            >
              Create Admin User
            </Button>
            <Button
              onClick={resetPassword}
              disabled={isLoading}
              variant="secondary"
              size="m"
            >
              Reset Password
            </Button>
          </Row>

          {result && (
            <Card padding="16" background="neutral-weak">
              <Column gap="8">
                <Text variant="label">Result:</Text>
                <pre
                  style={{
                    fontSize: '12px',
                    overflowX: 'auto',
                    backgroundColor: 'var(--neutral-900)',
                    color: 'var(--neutral-100)',
                    padding: '12px',
                    borderRadius: '6px',
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Column>
            </Card>
          )}

          <Card padding="16" background="accent-weak">
            <Column gap="8">
              <Text variant="label" onBackground="accent">
                Default Credentials:
              </Text>
              <Text variant="body-default-s" onBackground="accent">
                Email: admin@big12sports.com
                <br />
                Password: Conference12!
              </Text>
            </Column>
          </Card>
        </Column>
      </Card>

      <Card padding="24" fillWidth background="neutral-weak">
        <Column gap="16">
          <Heading variant="heading-strong-m">Next Steps</Heading>
          <Column gap="8">
            <Text variant="body-default-s">
              1. Create an admin user using the form above
            </Text>
            <Text variant="body-default-s">
              2. Go to the{' '}
              <a href="/login" style={{ color: 'var(--accent-600)' }}>
                login page
              </a>
            </Text>
            <Text variant="body-default-s">
              3. Sign in with your credentials
            </Text>
            <Text variant="body-default-s">4. Access the HELiiX dashboard</Text>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
