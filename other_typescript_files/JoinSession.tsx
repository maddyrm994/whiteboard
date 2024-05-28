import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinSession: React.FC = () => {
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/whiteboard/${sessionId}`);
  };

  return (
    <form onSubmit={handleJoinSession}>
      <h2>Join Session</h2>
      <div>
        <label>Session ID:</label>
        <input type="text" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
      </div>
      <button type="submit">Join</button>
    </form>
  );
};

export default JoinSession;
