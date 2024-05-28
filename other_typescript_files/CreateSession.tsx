import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const CreateSession: React.FC = () => {
  const [sessionName, setSessionName] = useState('');
  const navigate = useNavigate();

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSessionRef = push(ref(database, 'sessions'));
    const sessionId = newSessionRef.key;
    if (sessionId) {
      await set(newSessionRef, { name: sessionName });
      navigate(`/whiteboard/${sessionId}`);
    }
  };

  return (
    <form onSubmit={handleCreateSession}>
      <h2>Create Session</h2>
      <div>
        <label>Session Name:</label>
        <input type="text" value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateSession;
