export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '48px auto', padding: 16 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Welcome to Tech Institute Student Portal
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        Access your courses, track your progress, and connect with your learning journey.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a 
          href="/login" 
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Student Sign In
        </a>
        
        <a 
          href="/admin/login" 
          style={{
            padding: '12px 24px',
            backgroundColor: '#059669',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Admin Sign In
        </a>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Our Programs</h2>
        <p>We offer comprehensive courses in:</p>
        {/* We'll add the actual programs here once you share them */}
      </div>
    </main>
  );
}