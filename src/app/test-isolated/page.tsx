export default function TestIsolatedPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1>Isolated Test Page</h1>
      <p>No external dependencies - pure HTML/CSS</p>
      <p>If this shows a white screen, there's an issue with Next.js itself</p>

      <div style={{ marginTop: '40px' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Form submitted!');
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="test-email"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Email:
            </label>
            <input
              id="test-email"
              type="email"
              placeholder="test@example.com"
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #333',
                backgroundColor: '#111',
                color: '#fff',
                width: '250px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="test-password"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Password:
            </label>
            <input
              id="test-password"
              type="password"
              placeholder="Enter password"
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #333',
                backgroundColor: '#111',
                color: '#fff',
                width: '250px',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '250px',
            }}
          >
            Submit Test Form
          </button>
        </form>
      </div>
    </div>
  );
}
