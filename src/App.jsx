import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import About from "./pages/About";

import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Licenses from "./pages/Licenses";

import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminBlog from "./pages/admin/AdminBlog";
import Consultations from "./pages/admin/Consultations";
import Customers from "./pages/admin/Customers";
import AdminLicenses from "./pages/admin/Licenses";
import SiteInfo from "./pages/admin/SiteInfo";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/blog/:slug" element={<BlogDetails />}/>
        <Route path="/licenses" element={<Licenses/>}/>
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/consultations" element={ <Consultations />}/>
          <Route path="/admin/customers" element={ <Customers />}/>
          <Route path="/admin/licenses" element={<AdminLicenses />} />
          <Route path="/admin/site-info" element={<SiteInfo />} />
        </Route>
      </Route>
    </Routes>
  );
}