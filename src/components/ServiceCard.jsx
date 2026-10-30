import { Link } from "react-router-dom";

export default function ServiceCard({ icon, title, description, slug }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 border-0 shadow-sm rounded-4 p-3">
        <div className="card-body">
          <div className="fs-1 text-primary mb-3">
            <i className={`bi ${icon}`}></i>
          </div>

          <h3 className="h5 fw-bold mb-3">{title}</h3>

          <p className="text-secondary lh-lg mb-4">{description}</p>

          <Link
            to={`/services/${slug}`}
            className="text-primary fw-semibold"
          >
            اطلاعات بیشتر
            <i className="bi bi-arrow-left me-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}