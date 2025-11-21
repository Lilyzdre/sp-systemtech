import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

const Auth: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async () => {
    const { user, error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Check your email for confirmation link!')
  }

  const handleSignIn = async () => {
    const { user, error } = await supabase.auth.signIn({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Logged in successfully!')
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      <h2>Student Portal Auth</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', margin: '10px 0', width: '100%', padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', margin: '10px 0', width: '100%', padding: 8 }}
      />
      <button onClick={handleSignUp} style={{ marginRight: 10 }}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Auth
