
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";

const API_URL = import.meta.env.VITE_API_URL || "";

const emptySiteInfo = {
  companyName: "فناوری داده گستر نور",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
};

export default function Footer() {
  const [siteInfo, setSiteInfo] = useState(emptySiteInfo);

  useEffect(() => {
    async function fetchSiteInfo() {
      try {
        const response = await fetch(`${API_URL}/api/site-info`);

        if (!response.ok) {
          throw new Error("دریافت اطلاعات شرکت ناموفق بود.");
        }

        const data = await response.json();

        if (data) {
          setSiteInfo({
            companyName: data.companyName || emptySiteInfo.companyName,
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            postalCode: data.postalCode || "",
          });
        }
      } catch (error) {
        console.error("دریافت اطلاعات فوتر ناموفق بود:", error);
      }
    }

    fetchSiteInfo();
  }, []);

  return (
    <footer className="bg-dark text-white pt-5">
      <div className="container">
        <div className="row g-5 pb-5">
          <div className="col-lg-5">
            <img
              src={logo}
              alt={siteInfo.companyName}
              width="75"
              height="75"
              className="object-fit-contain mb-3"
            />

            <h3 className="h5 fw-bold mb-3">
              {siteInfo.companyName}
            </h3>

            <p className="text-white-50 lh-lg mb-0">
              ارائه راهکارهای تخصصی در حوزه شبکه، زیرساخت و فناوری اطلاعات
              برای کسب‌وکارها و سازمان‌ها.
            </p>
          </div>

          <div className="col-6 col-lg-3">
            <h4 className="h6 fw-bold mb-4">دسترسی سریع</h4>

            <div className="d-flex flex-column gap-3">
              <Link to="/" className="text-white-50">
                صفحه اصلی
              </Link>
              <Link to="/services" className="text-white-50">
                خدمات
              </Link>
              <Link to="/about" className="text-white-50">
                درباره ما
              </Link>
              <Link to="/projects" className="text-white-50">
                پروژه‌ها
              </Link>
              <Link to="/contact" className="text-white-50">
                تماس با ما
              </Link>
            </div>
          </div>

          <div className="col-6 col-lg-4">
            <h4 className="h6 fw-bold mb-4">ارتباط با ما</h4>

            <div className="d-flex flex-column gap-3 text-white-50">
              {siteInfo.phone && (
                <div className="d-flex gap-2">
                  <i className="bi bi-telephone text-primary"></i>
                  <a
                    href={`tel:${siteInfo.phone}`}
                    className="text-white-50 text-decoration-none"
                    dir="ltr"
                  >
                    {siteInfo.phone}
                  </a>
                </div>
              )}

              {siteInfo.email && (
                <div className="d-flex gap-2">
                  <i className="bi bi-envelope text-primary"></i>
                  <a
                    href={`mailto:${siteInfo.email}`}
                    className="text-white-50 text-decoration-none"
                  >
                    {siteInfo.email}
                  </a>
                </div>
              )}

              {siteInfo.address && (
                <div className="d-flex gap-2">
                  <i className="bi bi-geo-alt text-primary"></i>
                  <span>{siteInfo.address}</span>
                </div>
              )}

              {siteInfo.postalCode && (
                <div className="d-flex gap-2">
                  <i className="bi bi-mailbox text-primary"></i>
                  <span>{siteInfo.postalCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-top border-secondary py-4 text-center text-white-50 small">
          © {siteInfo.companyName} — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
