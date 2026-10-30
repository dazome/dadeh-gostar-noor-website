
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

const initialForm = {
  name: "",
  phone: "",
  company: "",
  service: "",
  description: "",
};

const emptySiteInfo = {
  phone: "",
  email: "",
  address: "",
  postalCode: "",
};

const services = [
  "طراحی و اجرای شبکه",
  "پشتیبانی شبکه و IT",
  "خدمات اکتیو شبکه",
  "خدمات پسیو شبکه",
  "سرور و مجازی‌سازی",
  "امنیت شبکه",
  "پشتیبان‌گیری و بازیابی اطلاعات",
  "ارتباطات سازمانی و VoIP",
  "سایر موارد",
];

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [siteInfo, setSiteInfo] = useState(emptySiteInfo);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function fetchSiteInfo() {
      try {
        const response = await fetch(`${API_URL}/api/site-info`);

        if (!response.ok) {
          throw new Error("دریافت اطلاعات تماس ناموفق بود.");
        }

        const data = await response.json();

        if (data) {
          setSiteInfo({
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            postalCode: data.postalCode || "",
          });
        }
      } catch (error) {
        console.error("دریافت اطلاعات تماس ناموفق بود:", error);
      }
    }

    fetchSiteInfo();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/consultations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "ثبت درخواست انجام نشد.");
      }

      setForm(initialForm);
      setFeedback({
        type: "success",
        message: data.message,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.message ||
          "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-light py-5">
        <div className="container text-center">
          <h1 className="fw-bold mb-3">تماس با ما</h1>

          <p className="text-secondary col-lg-6 mx-auto lh-lg mb-3">
            برای دریافت اطلاعات بیشتر درباره خدمات و بررسی نیازهای
            فناوری اطلاعات مجموعه خود با ما در ارتباط باشید.
          </p>

          <div className="d-flex justify-content-center align-items-center gap-2 small">
            <Link to="/" className="text-decoration-none">
              صفحه اصلی
            </Link>
            <i className="bi bi-chevron-left text-secondary"></i>
            <span className="text-secondary">تماس با ما</span>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-lg-4">
          <div className="row g-5">
            <div className="col-lg-5">
              <p className="text-primary fw-semibold mb-2">
                ارتباط با ما
              </p>

              <h2 className="fw-bold lh-base mb-3">
                برای مشاوره و اطلاعات بیشتر با ما در ارتباط باشید
              </h2>

              <p className="text-secondary lh-lg mb-5">
                کارشناسان مجموعه آماده بررسی نیازهای شما و ارائه
                اطلاعات بیشتر درباره خدمات شبکه و زیرساخت فناوری
                اطلاعات هستند.
              </p>

              {siteInfo.phone && (
                <div className="d-flex align-items-start gap-3 mb-4">
                  <i className="bi bi-telephone fs-4 text-primary"></i>
                  <div>
                    <h3 className="h6 fw-bold">شماره تماس</h3>
                    <a
                      href={`tel:${siteInfo.phone}`}
                      className="text-secondary text-decoration-none"
                      dir="ltr"
                    >
                      {siteInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {siteInfo.email && (
                <div className="d-flex align-items-start gap-3 mb-4">
                  <i className="bi bi-envelope fs-4 text-primary"></i>
                  <div>
                    <h3 className="h6 fw-bold">ایمیل</h3>
                    <a
                      href={`mailto:${siteInfo.email}`}
                      className="text-secondary text-decoration-none"
                    >
                      {siteInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {siteInfo.address && (
                <div className="d-flex align-items-start gap-3 mb-4">
                  <i className="bi bi-geo-alt fs-4 text-primary"></i>
                  <div>
                    <h3 className="h6 fw-bold">آدرس</h3>
                    <p className="text-secondary lh-lg mb-0">
                      {siteInfo.address}
                    </p>
                  </div>
                </div>
              )}

              {siteInfo.postalCode && (
                <div className="d-flex align-items-start gap-3">
                  <i className="bi bi-mailbox fs-4 text-primary"></i>
                  <div>
                    <h3 className="h6 fw-bold">کد پستی</h3>
                    <p className="text-secondary mb-0">
                      {siteInfo.postalCode}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-7">
              <div className="bg-light rounded-4 p-4 p-lg-5">
                <h2 className="h3 fw-bold mb-2">درخواست مشاوره</h2>

                <p className="text-secondary lh-lg mb-4">
                  اطلاعات خود را وارد کنید تا درخواست شما بررسی شود.
                </p>

                {feedback && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`alert ${
                      feedback.type === "success"
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="contact-name" className="form-label">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className="form-control py-3"
                        placeholder="نام شما"
                        value={form.name}
                        onChange={handleChange}
                        maxLength={255}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="contact-phone" className="form-label">
                        شماره تماس *
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        className="form-control py-3"
                        placeholder="شماره تماس"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={50}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="contact-company" className="form-label">
                        نام شرکت یا مجموعه
                      </label>
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        className="form-control py-3"
                        placeholder="نام مجموعه"
                        value={form.company}
                        onChange={handleChange}
                        maxLength={255}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="contact-service" className="form-label">
                        موضوع درخواست
                      </label>
                      <select
                        id="contact-service"
                        name="service"
                        className="form-select py-3"
                        value={form.service}
                        onChange={handleChange}
                      >
                        <option value="">انتخاب خدمت</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label
                        htmlFor="contact-description"
                        className="form-label"
                      >
                        توضیحات
                      </label>
                      <textarea
                        id="contact-description"
                        name="description"
                        className="form-control"
                        rows="5"
                        placeholder="درخواست خود را توضیح دهید..."
                        value={form.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary px-5 py-3"
                        disabled={loading}
                      >
                        {loading ? "در حال ارسال..." : "ارسال درخواست"}
                        <i className="bi bi-arrow-left me-2"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
