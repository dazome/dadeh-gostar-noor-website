import { Link } from "react-router-dom";
import { services } from "../data/services";


export default function Services() {
  return (
    <>
      <section className="bg-light py-5">
        <div className="container">
          <div className="text-center">
            <h1 className="fw-bold mb-3">خدمات ما</h1>

            <p className="text-secondary col-lg-6 mx-auto lh-lg mb-3">
              راهکارهای تخصصی شبکه و فناوری اطلاعات برای راه‌اندازی، توسعه،
              امنیت و پشتیبانی زیرساخت سازمان شما
            </p>

            <div className="d-flex justify-content-center align-items-center gap-2 small">
              <Link to="/" className="text-decoration-none">
                صفحه اصلی
              </Link>

              <i className="bi bi-chevron-left text-secondary"></i>
              <span className="text-secondary">خدمات</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-lg-4">
          <div className="mb-5 col-lg-7">
            <p className="text-primary fw-semibold mb-2">حوزه‌های خدماتی</p>

            <h2 className="fw-bold mb-3">خدمات تخصصی شبکه و زیرساخت</h2>

            <p className="text-secondary lh-lg mb-0">
              از طراحی و اجرای شبکه تا پشتیبانی، امنیت و مدیریت زیرساخت، خدمات
              مورد نیاز سازمان‌ها را در حوزه فناوری اطلاعات ارائه می‌کنیم.
            </p>
          </div>

          <div className="row g-4">
            {services.map((service) => (
              <div className="col-md-6" key={service.slug}>
                <div className="border rounded-4 p-4 h-100">
                  <div
                    className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                    style={{ width: "52px", height: "52px" }}
                  >
                    <i className={`bi ${service.icon} fs-4`}></i>
                  </div>

                  <h3 className="h4 fw-bold mb-2">{service.title}</h3>

                  <p className="text-secondary lh-lg mb-3">
                    {service.description}
                  </p>

                  <ul className="list-unstyled mb-3">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="d-flex align-items-center gap-2 mb-2"
                      >
                        <i className="bi bi-check-circle text-primary"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/services/${service.slug}`}
                    className="text-primary fw-semibold text-decoration-none"
                  >
                    مشاهده جزئیات
                    <i className="bi bi-arrow-left me-2"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-5">
        <div className="container">
          <div className="bg-primary text-white rounded-4 p-4 p-lg-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="fw-bold mb-3">
                  برای انتخاب راهکار مناسب نیاز به مشاوره دارید؟
                </h2>

                <p className="mb-0 opacity-75 lh-lg">
                  برای بررسی نیازهای زیرساختی مجموعه و انتخاب خدمات مناسب، با ما
                  در ارتباط باشید.
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