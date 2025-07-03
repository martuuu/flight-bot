export default function TestPage() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>🎉 Flight Bot Test Page</h1>
      <p>Si ves esto, la webapp básica funciona!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Variables de entorno:</h2>
        <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'No configurada'}</p>
        <p>NODE_ENV: {process.env.NODE_ENV || 'No configurada'}</p>
      </div>
    </div>
  )
}
