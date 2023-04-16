import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar({ loggedIn, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">TeleDoctor</div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        {loggedIn ? (
          <>
            <li className="nav-item">
              <Link to="/appointments" className="nav-link">
                Appointments
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link button" onClick={onLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
