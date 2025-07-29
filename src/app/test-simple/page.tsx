'use client';

export default function TestSimplePage() {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1>Simple Test Page</h1>
      <p>This is a basic HTML page without Once UI components</p>
      <p>If you can see this, Next.js routing is working correctly</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Debug Info:</h2>
        <p>Current Time: {new Date().toLocaleString()}</p>
        <p>
          Browser:{' '}
          {typeof window !== 'undefined' ? 'Client-side' : 'Server-side'}
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => alert('Button clicked!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Click to test interactivity
        </button>
      </div>
    </div>
  );
}
