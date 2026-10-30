import { Link } from "react-router-dom";
import aboutImage from "../assets/About.png";

const processSteps = [
  {
    number: "01",
    icon: "bi-search",
    title: "بررسی نیاز",
    text: "بررسی شرایط، زیرساخت موجود و نیازهای فنی مجموعه."
  },
  {
    number: "02",
    icon: "bi-bezier2",
    title: "طراحی راهکار",
    text: "طراحی راهکار متناسب با ساختار و نیازهای مجموعه."
  },
  {
    number: "03",
    icon: "bi-gear",
    title: "اجرا",
    text: "پیاده‌سازی و راه‌اندازی زیرساخت و سرویس‌های مورد نیاز."
  },
  {
    number: "04",
    icon: "bi-headset",
    title: "پشتیبانی",
    text: "نگهداری، بررسی و پشتیبانی زیرساخت پس از راه‌اندازی."
  }
];

export default function About() {
  return (
    <>
      <section className="bg-light py-5">
        <div className="container">
          <div className="text-center">
            <h1 className="fw-bold mb-3">درباره ما</h1>

            <p className="text-secondary col-lg-6 mx-auto lh-lg mb-3">
              آشنایی بیشتر با فناوری داده گستر نور و رویکرد ما در ارائه
              راهکارهای شبکه و زیرساخت فناوری اطلاعات
            </p>

            <div className="d-flex justify-content-center align-items-center gap-2 small">
              <Link to="/" className="text-decoration-none">
                صفحه اصلی
              </Link>

              <i className="bi bi-chevron-left text-secondary"></i>
              <span className="text-secondary">درباره ما</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="text-primary fw-semibold mb-2">
                فناوری داده گستر نور
              </p>

              <h2 className="fw-bold lh-base mb-4">
                راهکارهای فناوری اطلاعات متناسب با نیاز سازمان‌ها
              </h2>

              <p className="text-secondary lh-lg mb-3">
                فناوری داده گستر نور در حوزه شبکه، زیرساخت و خدمات فناوری
                اطلاعات فعالیت می‌کند و با بررسی نیازهای هر مجموعه، راهکارهای
                متناسب با ساختار و شرایط آن ارائه می‌دهد.
              </p>

              <p className="text-secondary lh-lg mb-0">
                تمرکز ما بر ایجاد زیرساخت‌هایی است که علاوه بر پاسخ‌گویی به
                نیازهای فعلی سازمان، از نظر امنیت، پایداری و امکان توسعه نیز
                شرایط مناسبی داشته باشند.
              </p>
            </div>

            <div className="col-lg-6">
              <img
                src={aboutImage}
                alt="فناوری داده گستر نور"
                className="img-fluid rounded-4 w-100 object-fit-cover"
                style={{ height: "380px" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-lg-3">
          <div className="mb-5 col-lg-7">
            <p className="text-primary fw-semibold mb-2">حوزه فعالیت</p>

            <h2 className="fw-bold mb-3">
              همراه سازمان‌ها در مدیریت زیرساخت فناوری اطلاعات
            </h2>

            <p className="text-secondary lh-lg mb-0">
              خدمات مجموعه بخش‌های مختلف زیرساخت فناوری اطلاعات را از طراحی و
              اجرا تا نگهداری و توسعه پوشش می‌دهد.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="bg-white rounded-4 p-4 h-100">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className="bi bi-diagram-3 fs-4"></i>
                </div>

                <h3 className="h5 fw-bold mb-2">شبکه</h3>
                <p className="text-secondary lh-lg mb-0">
                  طراحی، اجرا و توسعه زیرساخت شبکه متناسب با نیاز سازمان.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="bg-white rounded-4 p-4 h-100">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className="bi bi-headset fs-4"></i>
                </div>

                <h3 className="h5 fw-bold mb-2">پشتیبانی</h3>
                <p className="text-secondary lh-lg mb-0">
                  نگهداری و پشتیبانی شبکه، تجهیزات و زیرساخت فناوری اطلاعات.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="bg-white rounded-4 p-4 h-100">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className="bi bi-shield-check fs-4"></i>
                </div>

                <h3 className="h5 fw-bold mb-2">امنیت</h3>
                <p className="text-secondary lh-lg mb-0">
                  ارائه راهکارهای مناسب برای افزایش امنیت شبکه و حفاظت از
                  اطلاعات.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="bg-white rounded-4 p-4 h-100">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className="bi bi-server fs-4"></i>
                </div>

                <h3 className="h5 fw-bold mb-2">سرور و زیرساخت</h3>
                <p className="text-secondary lh-lg mb-0">
                  راه‌اندازی و مدیریت سرورها و زیرساخت‌های مورد نیاز سازمان.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 overflow-hidden">
        <div className="container py-lg-5">
          <div className="text-center mb-5">
            <p className="text-primary fw-semibold mb-2">رویکرد ما</p>

            <h2 className="fw-bold mb-3">
              از بررسی نیاز تا اجرا و پشتیبانی
            </h2>

            <p className="text-secondary lh-lg col-lg-7 mx-auto mb-0">
              هر پروژه از شناخت دقیق نیازهای مجموعه آغاز می‌شود و پس از طراحی
              و اجرا، با پشتیبانی و نگهداری زیرساخت ادامه پیدا می‌کند.
            </p>
          </div>

          <div className="process-cycle d-none d-lg-block">
            <div className="process-circle">
              <div className="process-center">
                <i className="bi bi-arrow-repeat"></i>
                <strong>فرایند همکاری</strong>
                <span>از نیازسنجی تا پشتیبانی</span>
              </div>

              {processSteps.map((step, index) => (
                <div
                  className={`process-step process-step-${index + 1}`}
                  key={step.title}
                >
                  <div className="process-icon">
                    <i className={`bi ${step.icon}`}></i>
                  </div>

                  <span className="process-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="d-lg-none">
            <div className="mobile-process">
              {processSteps.map((step, index) => (
                <div className="mobile-process-step" key={step.title}>
                  <div className="mobile-process-icon">
                    <i className={`bi ${step.icon}`}></i>
                  </div>

                  <div>
                    <span className="text-primary fw-bold small">
                      مرحله {step.number}
                    </span>

                    <h3 className="h5 fw-bold mt-1 mb-2">
                      {step.title}
                    </h3>

                    <p className="text-secondary lh-lg mb-0">
                      {step.text}
                    </p>
                  </div>

                  {index !== processSteps.length - 1 && (
                    <div className="mobile-process-line"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-5">
        <div className="container">
          <div className="bg-primary text-white rounded-4 p-4 p-lg-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="fw-bold mb-3">درباره خدمات ما سوالی دارید؟</h2>

                <p className="mb-0 opacity-75 lh-lg">
                  برای دریافت اطلاعات بیشتر و بررسی نیازهای مجموعه خود با ما در
                  ارتباط باشید.
                </p>
              </div>

              <div className="col-lg-4 text-lg-start">
                <Link
                  to="/contact"
                  className="btn btn-light text-primary fw-semibold px-4 py-3"
                >
                  ارتباط با ما
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