import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDoctorProfile, updateDoctorProfile } from "../utils/api";

const DoctorProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    speciality: "",
    location: "",
    experience: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const data = await getDoctorProfile();
        setFormData(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchDoctorProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoctorProfile(formData);
      alert("Doctor profile updated successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="doctor-profile">
      <h1>Doctor Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="speciality">Speciality:</label>
          <input
            type="text"
            name="speciality"
            value={formData.speciality}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="experience">Experience:</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default DoctorProfile;
