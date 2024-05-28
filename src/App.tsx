import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Whiteboard from './components/Whiteboard';

const App = () => {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Whiteboard />} />
        </Routes>
    </Router>
  );
};

export default App;
