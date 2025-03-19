import Navbar from "./components/Navbar.jsx";
import { Route, Routes } from "react-router-dom";
import {
  HomePage,
  SignupPage,
  LoginPage,
  SettingsPage,
  ProfilePage,
} from "./pages";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
