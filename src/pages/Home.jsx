import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/Hero.png";
import aboutImage from "../assets/About.png";
import ServiceCard from "../components/ServiceCard";

const API_URL = import.meta.env.VITE_API_URL || "";

const services = [
  {
    icon: "bi-diagram-3",
    title: "طراحی و اجرای شبکه",
    description:
      "طراحی و پیاده‌سازی زیرساخت شبکه متناسب با نیاز و ساختار سازمان.",
    slug: "network",
  },
  {
    icon: "bi-headset",
    title: "پشتیبانی شبکه",
    description:
      "نگهداری، عیب‌یابی و پشتیبانی زیرساخت‌های شبکه و تجهیزات سازمانی.",
    slug: "network-support",
  },
  {
    icon: "bi-shield-check",
    title: "امنیت شبکه",
    description:
      "ارائه راهکارهای امنیتی برای حفاظت از شبکه، اطلاعات و منابع سازمان.",
    slug: "network-security",
  },
  {
    icon: "bi-server",
    title: "سرور و مجازی‌سازی",
    description:
      "راه‌اندازی و مدیریت سرورها و راهکارهای مجازی‌سازی برای استفاده بهینه از منابع.",
    slug: "server-virtualization",
  },
  {
    icon: "bi-telephone",
    title: "VoIP و ارتباطات",
    description:
      "راه‌اندازی سیستم‌های تلفنی تحت شبکه و راهکارهای ارتباطی سازمانی.",
    slug: "voip",
  },
  {
    icon: "bi-ethernet",
    title: "خدمات پسیو شبکه",
    description:
      "اجرای کابل‌کشی ساخت‌یافته، رک و زیرساخت فیزیکی مورد نیاز شبکه.",
    slug: "passive-network",
  },
];

export default function Home() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/customers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("دریافت مشتریان ناموفق بود.");
        }

        return response.json();
      })
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("خطا در دریافت مشتریان:", error);
      });
  }, []);

  return (
    <>
    
      <section className="container-fluid px-3 px-lg-4 py-3">
        <div
          className="position-relative overflow-hidden rounded-4"
          style={{ minHeight: "580px" }}
        >
          <img
            src={heroImage}
            alt="راهکارهای فناوری اطلاعات"
            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          />

          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>

          <div className="position-relative h-100 d-flex align-items-center">
            <div className="container-fluid h-100 px-4 px-lg-5 py-5">
              <div className="row h-100 align-items-center">
                <div className="col-lg-6 text-white">
                  <p className="mb-3 fw-medium">فناوری داده گستر نور</p>

                  <h1 className="display-5 fw-bold lh-base mb-4">
                    راهکارهای تخصصی فناوری اطلاعات برای کسب‌وکار شما
                  </h1>

                  <p className="fs-5 lh-lg mb-4 col-lg-11">
                    طراحی، اجرا و پشتیبانی زیرساخت‌های شبکه و فناوری اطلاعات با
                    راهکارهای حرفه‌ای و متناسب با نیاز سازمان شما
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    <Link to="/services" className="btn btn-primary btn-lg px-4">
                      مشاهده خدمات
                    </Link>

                    <Link
                      to="/contact"
                      className="btn btn-outline-light btn-lg px-4"
                    >
                      دریافت مشاوره
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <p className="text-primary fw-semibold mb-2">خدمات ما</p>

            <h2 className="fw-bold mb-3">
              راهکارهای فناوری برای کسب‌وکار شما
            </h2>

            <p className="text-secondary mx-auto col-lg-6 lh-lg">
              مجموعه‌ای از خدمات تخصصی در حوزه شبکه، زیرساخت و فناوری اطلاعات
              برای ایجاد بستری پایدار، امن و قابل توسعه.
            </p>
          </div>

          <div className="row g-4">
            {services.map((service) => (
              <ServiceCard key={service.slug} {...service} />
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/services" className="btn btn-outline-primary px-4 py-2">
              مشاهده همه خدمات
            </Link>
          </div>
        </div>
      </section>

     
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="text-primary fw-semibold mb-2">درباره ما</p>

              <h2 className="fw-bold lh-base mb-4">
                همراه کسب‌وکارها در مسیر توسعه زیرساخت‌های فناوری اطلاعات
              </h2>

              <p className="text-secondary lh-lg mb-4">
                فناوری داده گستر نور با ارائه راهکارهای تخصصی در حوزه شبکه و
                زیرساخت فناوری اطلاعات، به سازمان‌ها در ایجاد بستری پایدار،
                امن و متناسب با نیازهایشان کمک می‌کند.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-primary"></i>
                  <span>راهکارهای متناسب با نیاز هر سازمان</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-primary"></i>
                  <span>خدمات تخصصی شبکه و زیرساخت</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-primary"></i>
                  <span>تمرکز بر امنیت، پایداری و توسعه‌پذیری</span>
                </div>
              </div>

              <Link to="/about" className="btn btn-primary px-4 py-2">
                بیشتر درباره ما
                <i className="bi bi-arrow-left me-2"></i>
              </Link>
            </div>

            <div className="col-lg-6">
              <img
                src={aboutImage}
                alt="زیرساخت شبکه و فناوری اطلاعات"
                className="img-fluid rounded-4"
              />
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-5">
        <div className="container">
          <div className="mb-4 col-lg-7">
            <p className="text-primary fw-semibold mb-2">
              چرا داده گستر نور؟
            </p>

            <h2 className="fw-bold lh-base mb-3">
              راهکارهایی با تمرکز بر پایداری، امنیت و نیاز واقعی سازمان
            </h2>

            <p className="text-secondary lh-lg mb-0">
              هدف ما ارائه راهکارهایی است که علاوه بر پاسخ‌گویی به نیازهای فعلی،
              امکان توسعه و مدیریت بهتر زیرساخت فناوری اطلاعات را نیز فراهم
              کنند.
            </p>
          </div>

          <div className="row g-3">
            <div className="col-sm-6 col-lg-3">
              <div className="h-100 border rounded-4 p-4">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className="bi bi-sliders fs-4"></i>
                </div>

                <h3 className="h5 fw-bold mb-2">راهکار متناسب</h3>

                <p className="text-secondary lh-lg mb-0">
                  انتخاب و پیاده‌سازی راهکار متناسب با ساختار و نیاز هر مجموعه.
                </p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="h-100 border rounded-4 p-4">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className="bi bi-shield-lock fs-4"></i>
                </div>

                <h3 className="h5 fw-bold mb-2">امنیت</h3>

                <p className="text-secondary lh-lg mb-0">
                  توجه به امنیت شبکه و حفاظت از اطلاعات در طراحی زیرساخت.
                </p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="h-100 border rounded-4 p-4">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className="bi bi-activity fs-4"></i>
                </div>

                <h3 className="h5 fw-bold mb-2">پایداری زیرساخت</h3>

                <p className="text-secondary lh-lg mb-0">
                  تمرکز بر ایجاد زیرساختی پایدار و قابل اتکا برای فعالیت سازمان.
                </p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="h-100 border rounded-4 p-4">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className="bi bi-headset fs-4"></i>
                </div>

                <h3 className="h5 fw-bold mb-2">پشتیبانی تخصصی</h3>

                <p className="text-secondary lh-lg mb-0">
                  همراهی در نگهداری، عیب‌یابی و مدیریت زیرساخت‌های فناوری
                  اطلاعات.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-5 bg-light overflow-hidden">
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-primary fw-semibold mb-2">مشتریان ما</p>

            <h2 className="fw-bold mb-3">برخی از مشتریان ما</h2>

            <p className="text-secondary col-lg-6 mx-auto lh-lg mb-0">
              افتخار همکاری با مجموعه‌ها و سازمان‌های مختلف در حوزه فناوری
              اطلاعات
            </p>
          </div>

          {customers.length > 0 ? (
            <div className="customer-slider">
              <div className="customer-track">
                {[...customers, ...customers].map((customer, index) => (
                 <div
  className="customer-item"
  key={`${customer.id}-${index}`}
  aria-hidden={index >= customers.length}
>
  {customer.logo && (
    <img
      src={`${API_URL}${customer.logo}`}
      alt=""
      className="customer-logo"
      loading="lazy"
    />
  )}

  <span>{customer.name}</span>
</div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-secondary mb-0">
              مشتریان این بخش به‌زودی معرفی می‌شوند.
            </p>
          )}
        </div>
      </section>

      
      <section className="py-4">
        <div className="container">
          <div className="bg-primary text-white rounded-4 p-4 p-lg-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <p className="fw-semibold mb-2 opacity-75">
                  نیاز به مشاوره دارید؟
                </p>

                <h2 className="fw-bold lh-base mb-3">
                  برای توسعه زیرساخت فناوری اطلاعات کسب‌وکار خود با ما در ارتباط
                  باشید
                </h2>

                <p className="mb-0 opacity-75 lh-lg">
                  برای بررسی نیازهای مجموعه و دریافت اطلاعات بیشتر درباره خدمات،
                  با کارشناسان ما در ارتباط باشید.
                </p>
              </div>

              <div className="col-lg-4 text-lg-start">
                <Link
                  to="/contact"
                  className="btn btn-light text-primary fw-semibold px-4 py-3"
                >
                  درخواست مشاوره
                  <i className="bi bi-arrow-left me-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}