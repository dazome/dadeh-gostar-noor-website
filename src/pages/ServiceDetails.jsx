import { Link, useParams } from "react-router-dom";
import { services } from "../data/services";

export default function ServiceDetails() {
  const { slug } = useParams();

  const service = services.find((item) => item.slug === slug);


  if (!service) {
    return (
      <section className="py-5">
        <div className="container text-center py-5">
          <h1 className="fw-bold mb-4">خدمت مورد نظر پیدا نشد</h1>

          <Link to="/services" className="btn btn-primary">
            بازگشت به خدمات
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-light py-4 py-lg-5">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6">
              <div
                className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                style={{ width: "56px", height: "56px" }}
              >
                <i className={`bi ${service.icon} fs-3`}></i>
              </div>

              <h1 className="fw-bold mb-3">{service.title}</h1>

              <p className="text-secondary fs-5 lh-lg mb-4">
                {service.intro}
              </p>

              <div className="d-flex flex-wrap align-items-center gap-2 small">
                <Link to="/" className="text-decoration-none">
                  صفحه اصلی
                </Link>

                <i className="bi bi-chevron-left text-secondary"></i>

                <Link to="/services" className="text-decoration-none">
                  خدمات
                </Link>

                <i className="bi bi-chevron-left text-secondary"></i>

                <span className="text-secondary">{service.title}</span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="service-image-wrapper">
                <img
                  src={service.image}
                  alt={service.title}
                  className="service-image"
                  style={{ objectPosition: service.imagePosition }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <p className="text-primary fw-semibold mb-2">معرفی خدمت</p>

              <h2 className="fw-bold mb-3">{service.title}</h2>

              <p className="text-secondary lh-lg mb-4">
                {service.description}
              </p>

              <h3 className="h5 fw-bold mb-3">خدمات این بخش شامل</h3>

              <div className="row g-3">
                {service.items.map((item) => (
                  <div className="col-md-6" key={item}>
                    <div className="border rounded-3 p-3 h-100 d-flex align-items-center gap-3">
                      <i className="bi bi-check-circle-fill text-primary"></i>
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-light rounded-4 p-4">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="bi bi-headset fs-4"></i>
                </div>

                <h3 className="h4 fw-bold mb-3">نیاز به مشاوره دارید؟</h3>

                <p className="text-secondary lh-lg mb-4">
                  برای بررسی نیازهای مجموعه و دریافت اطلاعات بیشتر درباره این
                  خدمت با ما در ارتباط باشید.
                </p>

                <Link to="/contact" className="btn btn-primary w-100 py-2">
                  درخواست مشاوره
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}