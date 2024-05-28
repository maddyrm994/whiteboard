import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to Collaborative Whiteboard!</h1>
      <h3>Please Sign Up or Login to continue!</h3>
      <div className="buttonContainer">
        <Link to="/signup" className="buttonLink">
          <button className="button">Sign Up</button>
        </Link>
        <Link to="/login" className="buttonLink">
          <button className="button">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
