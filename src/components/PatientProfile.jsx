import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientProfile.css";

function PatientProfile({ user }) {
  const history = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!user) {
      history.push("/login");
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, history]);

  const handleLogout = () => {
    axios
      .post("/api/auth/logout")
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="profile">
      <h2>My Profile</h2>
      <div className="profile-details">
        <div className="profile-field">
          <label>Name:</label>
          <div className="profile-value">{name}</div>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <div className="profile-value">{email}</div>
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default PatientProfile;
