import React from "react";
import { Link } from "react-router-dom";

import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to nkhekhe</h1>
      <p>
        Please use your email to login, OR hit the "Register button to join."
      </p>
      <Link to="/login" className="button login-button">
        Login
      </Link>
      <Link to="/register" className="button register-button">
        Register
      </Link>
    </div>
  );
};

export default HomePage;
