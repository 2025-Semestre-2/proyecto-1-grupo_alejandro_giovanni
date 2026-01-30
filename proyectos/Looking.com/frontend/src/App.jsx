import { Routes, Route } from "react-router-dom";

import BackendTest from "./BackendTest";

import Home from "./Home";
import Search from "./Search";
import Preview from "./Preview"
import Book from "./Book"
import Profile from "./Profile"
import Login from "./Login"
import SignupUser from "./SignupUser"
import SignupCompany from "./SignupCompany"
import CompanyProfile from "./CompanyProfile"
import CompanyServices from "./CompanyServices"
import CompanyActivities from "./CompanyActivities"
import CompanyBookings from "./CompanyBookings"
import CompanyReports from "./CompanyReports"
import AdminUsers from "./AdminUsers"
import AdminCompaniesHosting from "./AdminCompaniesHosting"
import AdminCompaniesEntertainment from "./AdminCompaniesEntertainment"
import EditUserInfo from "./EditUserInfo"
import EditCompanyInfo from "./EditCompanyInfo"
import EditRoomInfo from "./EditRoomInfo"
import EditActivityInfo from "./EditActivityInfo"
import PasswordChange from "./PasswordChange"

function App() {
  return (
    <Routes>
      <Route path="/backend-test" element={<BackendTest />} />

      <Route path="/" element={<Home />} />
      <Route path="/search/:role" element={<Search />} />
      <Route path="/preview/:role/:id" element={<Preview />} />
      <Route path="/book/:id" element={<Book />} />
      <Route path="/profile/:userid" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signupUser" element={<SignupUser />} />
      <Route path="/signupCompany" element={<SignupCompany />} />
      <Route path="/companyProfile/:companyid" element={<CompanyProfile />} />
      <Route path="/companyServices" element={<CompanyServices />} />
      <Route path="/companyActivities" element={<CompanyActivities />} />
      <Route path="/companyBookings" element={<CompanyBookings />} />
      <Route path="/companyReports" element={<CompanyReports />} />
      <Route path="/adminUsers" element={<AdminUsers />} />
      <Route path="/adminCompaniesHosting" element={<AdminCompaniesHosting />} />
      <Route path="/adminCompaniesEntertainment" element={<AdminCompaniesEntertainment />} />
      <Route path="/editUserInfo/:userid" element={<EditUserInfo />} />
      <Route path="/editCompanyInfo/:companyid" element={<EditCompanyInfo />} />
      <Route path="/editRoomInfo/:roomid" element={<EditRoomInfo />} />
      <Route path="/editActivityInfo/:activityid" element={<EditActivityInfo />} />
      <Route path="/passwordChange/:role/:id" element={<PasswordChange />} />
    </Routes>
  );
}

export default App;
