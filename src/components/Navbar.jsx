import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom py-2">
      <div className="container">
        <Link className="navbar-brand m-0" to="/">
          <img
            src={logo}
            alt="فناوری داده گستر نور"
            width="70"
            height="70"
            className="object-fit-contain"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="نمایش منو"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-lg-4 gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                صفحه اصلی
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/services">
                خدمات
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                درباره ما
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">
               وبلاگ
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/licenses">
              مجوز ها
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                تماس با ما
              </NavLink>
            </li>
          </ul>

          <div className="me-lg-auto mt-3 mt-lg-0">
            <Link to="/contact" className="btn btn-primary px-4 py-2">
              درخواست مشاوره
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}