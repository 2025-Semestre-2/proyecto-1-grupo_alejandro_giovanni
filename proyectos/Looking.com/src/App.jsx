import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";
import Preview from "./Preview"
import Book from "./Book"
import Profile from "./Profile"
import Login from "./Login"
import SignupUser from "./SignupUser"
import SignupCompany from "./SignupCompany"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/preview/:id" element={<Preview />} />
      <Route path="/book/:id" element={<Book />} />
      <Route path="/profile/:userid" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signupUser" element={<SignupUser />} />
      <Route path="/signupCompany" element={<SignupCompany />} />
    </Routes>
  );
}

export default App;
