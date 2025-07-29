'use client';

import { useState, useEffect } from 'react';
import { Column, Button, Input, Text, Card } from '@once-ui-system/core';

export default function TestLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('Test login page mounted');
    setMounted(true);

    // Log any errors
    window.addEventListener('error', (e) => {
      console.error('Window error:', e);
    });

    // Check if Once UI is loaded
    console.log('Once UI components available:', {
      Column: !!Column,
      Button: !!Button,
      Input: !!Input,
      Text: !!Text,
      Card: !!Card,
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Test form submitted!');
    console.log('Email:', email);
    console.log('Password:', password);
    alert(`Form submitted! Email: ${email}`);
  };

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#1a1a1a',
          color: 'white',
          minHeight: '100vh',
        }}
      >
        <h1>Loading test page...</h1>
      </div>
    );
  }

  // Fallback UI if Once UI components fail
  if (!Column || !Button || !Input || !Text || !Card) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#1a1a1a',
          color: 'white',
          minHeight: '100vh',
        }}
      >
        <h1>Once UI components not loaded</h1>
        <p>Check console for errors</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white',
      }}
    >
      <div
        style={{
          backgroundColor: '#2a2a2a',
          padding: '32px',
          borderRadius: '8px',
          width: '350px',
        }}
      >
        <h1 style={{ marginBottom: '24px' }}>Test Login Form</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '4px' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#1a1a1a',
                color: 'white',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '4px' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#1a1a1a',
                color: 'white',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            Submit Form
          </button>
        </form>
      </div>
    </div>
  );
}
