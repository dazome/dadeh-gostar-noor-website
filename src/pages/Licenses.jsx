import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLicenses() {
      try {
        const response = await fetch(`${API_URL}/api/licenses`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "دریافت مجوزها ناموفق بود."
          );
        }

        setLicenses(data);
      } catch (err) {
        setError(
          err.message || "ارتباط با سرور برقرار نشد."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLicenses();
  }, []);

  function isPdf(filePath) {
    return filePath?.toLowerCase().endsWith(".pdf");
  }

  return (
    <>
      <section className="bg-light py-5">
        <div className="container">
          <div className="text-center">
            <h1 className="fw-bold mb-3">
              مجوزها و گواهینامه‌ها
            </h1>

            <p className="text-secondary col-lg-7 mx-auto lh-lg mb-4">
              مجوزها، گواهینامه‌ها و مدارک معتبر شرکت فناوری داده گستر نور
            </p>

            <div className="d-flex justify-content-center align-items-center gap-2 small">
              <Link to="/" className="text-decoration-none">
                صفحه اصلی
              </Link>

              <i className="bi bi-chevron-left text-secondary"></i>

              <span className="text-secondary">
                مجوزها و گواهینامه‌ها
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <p className="text-primary fw-semibold mb-2">
              اعتبار و تخصص
            </p>

            <h2 className="fw-bold mb-3">
              مجوزها و گواهینامه‌های شرکت
            </h2>

            <p className="text-secondary lh-lg col-lg-7 mx-auto mb-0">
              در این بخش می‌توانید مجوزها و گواهینامه‌های دریافت‌شده توسط
              شرکت را مشاهده کنید.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
              >
                <span className="visually-hidden">
                  در حال بارگذاری...
                </span>
              </div>

              <p className="text-secondary mb-0">
                در حال دریافت مجوزها...
              </p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          ) : licenses.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-award display-3 text-secondary"></i>

              <h3 className="h5 fw-bold mt-3">
                هنوز مدرکی ثبت نشده است
              </h3>

              <p className="text-secondary mb-0">
                مدارک شرکت پس از ثبت توسط مدیر سایت در این بخش نمایش داده می‌شوند.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {licenses.map((license) => (
                <div
                  className="col-md-6 col-lg-4"
                  key={license.id}
                >
                  <div className="border rounded-4 p-4 h-100 text-center d-flex flex-column">
                    <div
                      className="d-flex align-items-center justify-content-center bg-light rounded-4 mb-4 overflow-hidden"
                      style={{ height: "220px" }}
                    >
                      {license.filePath ? (
                        isPdf(license.filePath) ? (
                          <div className="text-center">
                            <i className="bi bi-file-earmark-pdf text-danger display-3"></i>

                            <p className="text-secondary small mt-2 mb-0">
                              فایل PDF
                            </p>
                          </div>
                        ) : (
                          <a
                            href={`${API_URL}${license.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-100 h-100 d-flex align-items-center justify-content-center p-2"
                            aria-label={`مشاهده مدرک ${license.title}`}
                          >
                            <img
                              src={`${API_URL}${license.filePath}`}
                              alt={license.title}
                              className="mw-100 mh-100"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </a>
                        )
                      ) : (
                        <i className="bi bi-file-earmark-text text-secondary display-3"></i>
                      )}
                    </div>

                    <h3 className="h5 fw-bold mb-3">
                      {license.title}
                    </h3>

                    <p className="text-secondary small lh-lg mb-4 flex-grow-1">
                      {license.description ||
                        "توضیحات بیشتری برای این مدرک ثبت نشده است."}
                    </p>

                    {license.filePath && (
                      <a
                        href={`${API_URL}${license.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary align-self-center"
                      >
                        <i
                          className={`bi ${
                            isPdf(license.filePath)
                              ? "bi-file-earmark-pdf"
                              : "bi-eye"
                          } ms-2`}
                        ></i>

                        {isPdf(license.filePath)
                          ? "مشاهده فایل PDF"
                          : "مشاهده مدرک"}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
