'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Button, Card, Input, Text, useToast } from '@once-ui-system/core';
import { Loader2 } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!'); // Debug log
    setIsLoading(true);

    try {
      // Development mode: bypass authentication with demo credentials
      if (
        process.env.NODE_ENV === 'development' &&
        (email === 'admin@big12sports.com' ||
          email === 'demo@big12sports.com' ||
          email.includes('@big12sports.com'))
      ) {
        console.log('Development mode: Using mock authentication');
        addToast({ variant: 'success', message: 'Signed in successfully!' });
        window.location.href = '/dashboard';
        return;
      }

      if (showForgotPassword) {
        const { error } = await resetPassword(email);
        if (error) {
          addToast({ variant: 'danger', message: error.message });
        } else {
          addToast({
            variant: 'success',
            message: 'Password reset email sent! Check your inbox.',
          });
          setShowForgotPassword(false);
        }
      } else if (isSignUp) {
        if (password !== confirmPassword) {
          addToast({ variant: 'danger', message: 'Passwords do not match' });
          setIsLoading(false);
          return;
        }

        if (password.length < 8) {
          addToast({
            variant: 'danger',
            message: 'Password must be at least 8 characters long',
          });
          setIsLoading(false);
          return;
        }

        const userData = {
          first_name: firstName,
          last_name: lastName,
          department: department,
          role: 'viewer' as const, // Default role, will be updated by admin
        };

        const { error } = await signUp(email, password, userData);
        if (error) {
          addToast({ variant: 'danger', message: error.message });
        } else {
          addToast({
            variant: 'success',
            message: 'Account created! Please check your email to verify.',
          });
          // Reset form
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setFirstName('');
          setLastName('');
          setDepartment('');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          addToast({ variant: 'danger', message: error.message });
        }
      }
    } catch (error) {
      addToast({ variant: 'danger', message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('grid gap-6', className)}
      {...props}
    >
      <div className="grid gap-2">
        <div className="flex flex-col items-center text-center">
          {showForgotPassword && (
            <>
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email to receive a password reset link
              </p>
            </>
          )}
          {isSignUp && !showForgotPassword && (
            <>
              <h1 className="text-2xl font-bold">Join Big 12 HELiiX</h1>
              <p className="text-balance text-muted-foreground">
                Create your Big 12 Conference account
              </p>
            </>
          )}
          {!isSignUp && !showForgotPassword && (
            <>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-balance text-muted-foreground">
                Sign in to your Big 12 HELiiX account
              </p>
            </>
          )}
        </div>

        {/* First Name and Last Name for Sign Up */}
        {isSignUp && !showForgotPassword && (
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Text as="label" htmlFor="firstName" variant="label">
                First Name
              </Text>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Text as="label" htmlFor="lastName" variant="label">
                Last Name
              </Text>
              <Input
                id="lastName"
                type="text"
                placeholder="Smith"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Department for Sign Up */}
        {isSignUp && !showForgotPassword && (
          <div className="grid gap-2">
            <Text as="label" htmlFor="department" variant="label">
              Department
            </Text>
            <Input
              id="department"
              type="text"
              placeholder="e.g., Finance, Operations, Marketing"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={isLoading}
            />
          </div>
        )}

        <div className="grid gap-2">
          <Text as="label" htmlFor="email" variant="label">
            Email
          </Text>
          <Input
            id="email"
            type="email"
            placeholder="your.name@big12sports.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {!showForgotPassword && (
          <div className="grid gap-2">
            <div className="flex items-center">
              <Text as="label" htmlFor="password" variant="label">
                Password
              </Text>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="ml-auto inline-block text-sm underline-offset-4 hover:text-primary"
                >
                  Forgot your password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              minLength={isSignUp ? 8 : 6}
              placeholder={isSignUp ? 'At least 8 characters' : 'Password'}
            />
          </div>
        )}

        {/* Confirm Password for Sign Up */}
        {isSignUp && !showForgotPassword && (
          <div className="grid gap-2">
            <Text as="label" htmlFor="confirmPassword" variant="label">
              Confirm Password
            </Text>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: isLoading ? '#6b7280' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }
          }}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading
            ? showForgotPassword
              ? 'Sending reset email...'
              : isSignUp
                ? 'Creating account...'
                : 'Signing in...'
            : showForgotPassword
              ? 'Send Reset Email'
              : isSignUp
                ? 'Create Account'
                : 'Sign In'}
        </button>

        {/* Navigation buttons */}
        {showForgotPassword && (
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setEmail('');
              }}
              className="underline underline-offset-4 hover:text-primary"
            >
              Back to sign in
            </button>
          </div>
        )}

        {!isSignUp && !showForgotPassword && (
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setEmail('');
                setPassword('');
              }}
              className="underline underline-offset-4 hover:text-primary"
            >
              Create account
            </button>
          </div>
        )}

        {isSignUp && !showForgotPassword && (
          <div className="text-center text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFirstName('');
                setLastName('');
                setDepartment('');
              }}
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </button>
          </div>
        )}

        {/* Development mode notice */}
        {!isSignUp &&
          !showForgotPassword &&
          process.env.NODE_ENV === 'development' && (
            <div className="text-center text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
              <p>
                🔧 <strong>Development Mode:</strong> Use any @big12sports.com
                email with any password to sign in.
              </p>
            </div>
          )}

        {/* Security notice for sign up */}
        {isSignUp && !showForgotPassword && (
          <div className="text-center text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p>
              🔒 Your account will be created with viewer permissions. Contact
              your administrator to upgrade your access level.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
