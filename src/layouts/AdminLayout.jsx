
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const menuItems = [
  {
    to: "/admin",
    label: "داشبورد",
    icon: "bi-grid",
    end: true,
  },
  {
    to: "/admin/blog",
    label: "وبلاگ",
    icon: "bi-file-text",
  },
  {
    to: "/admin/customers",
    label: "مشتریان",
    icon: "bi-people",
  },
  {
    to: "/admin/licenses",
    label: "مجوزها و گواهینامه‌ها",
    icon: "bi-award",
  },
  {
    to: "/admin/site-info",
    label: "اطلاعات سایت",
    icon: "bi-building",
  },
  {
    to: "/admin/consultations",
    label: "درخواست‌های مشاوره",
    icon: "bi-chat-dots",
  },
];

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // بستن منو با کلید Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="admin-layout min-vh-100 bg-light">
    
      {menuOpen && (
        <button
          type="button"
          className="admin-backdrop"
          aria-label="بستن منو"
          onClick={closeMenu}
        />
      )}

    
      <aside
        id="admin-sidebar"
        className={`admin-sidebar bg-dark text-white ${
          menuOpen ? "admin-sidebar-open" : ""
        }`}
        aria-label="منوی پنل مدیریت"
      >
        <div className="admin-sidebar-header">
          <h2 className="h5 fw-bold mb-0">
            پنل مدیریت
          </h2>

          <button
            type="button"
            className="btn btn-outline-light admin-close-button"
            onClick={closeMenu}
            aria-label="بستن منو"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="d-flex flex-column gap-2 admin-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `admin-nav-link text-decoration-none p-3 rounded ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className={`bi ${item.icon} ms-2`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <hr className="border-secondary" />

          <button
            type="button"
            className="btn btn-outline-light w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right ms-2"></i>
            خروج از پنل
          </button>
        </div>
      </aside>

     
      <main className="admin-main">
       
        <header className="admin-mobile-header">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => setMenuOpen(true)}
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            aria-controls="admin-sidebar"
          >
            <i className="bi bi-list fs-5"></i>
          </button>

          <span className="fw-bold">
            پنل مدیریت
          </span>

          <span className="admin-mobile-spacer"></span>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
