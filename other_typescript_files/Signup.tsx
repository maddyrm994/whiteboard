import React, { useState } from 'react';
import firebase from './firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const { user } = userCredential;
      if (user) {
        console.log('User signed up successfully:', user);
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <div>{error}</div>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
