import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import DoctorProfile from "./components/DoctorProfile";
import RegisterPage from "./components/RegisterPage";
import PatientProfile from "./components/PatientProfile";
import AppointmentPage from "./components/AppointmentPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/appointments/:id" element={<AppointmentPage />} />
      </Routes>
    </div>
  );
}

export default App;
