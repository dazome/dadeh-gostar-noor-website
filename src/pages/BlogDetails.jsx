
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function BlogDetails() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");
        setPost(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/blog/slug/${encodeURIComponent(slug)}`
        );

        if (response.status === 404) {
          setPost(null);
          return;
        }

        if (!response.ok) {
          throw new Error("دریافت مقاله ناموفق بود.");
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError("دریافت مقاله با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <section className="container py-5 text-center">
        <p className="text-secondary">در حال دریافت مقاله...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container py-5 text-center">
        <p className="text-danger">{error}</p>

        <Link to="/blog" className="btn btn-primary">
          بازگشت به وبلاگ
        </Link>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="container py-5 text-center">
        <i className="bi bi-file-earmark-x text-secondary display-4"></i>

        <h1 className="fw-bold mt-3 mb-3">مقاله پیدا نشد</h1>

        <p className="text-secondary mb-4">
          مقاله‌ای با این مشخصات وجود ندارد یا ممکن است حذف شده باشد.
        </p>

        <Link to="/blog" className="btn btn-primary">
          بازگشت به وبلاگ
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="bg-light py-5">
        <div className="container">
          <div className="text-center">
            <span className="badge bg-primary-subtle text-primary mb-3">
              {post.category}
            </span>

            <h1 className="fw-bold lh-base mb-3">
              {post.title}
            </h1>

            <p className="text-secondary mb-4">
              {post.date ? String(post.date).slice(0, 10) : ""}
            </p>

            <div className="d-flex justify-content-center align-items-center gap-2 small">
              <Link to="/" className="text-decoration-none">
                صفحه اصلی
              </Link>

              <i className="bi bi-chevron-left text-secondary"></i>

              <Link to="/blog" className="text-decoration-none">
                وبلاگ
              </Link>

              <i className="bi bi-chevron-left text-secondary"></i>

              <span className="text-secondary">جزئیات مقاله</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <article className="mx-auto" style={{ maxWidth: "850px" }}>
        
{post.image ? (
  <img
    src={`${import.meta.env.VITE_API_URL || ""}${post.image}`}
    alt={post.title}
    className="img-fluid rounded-4 mb-4 w-100"
    style={{
      maxHeight: "450px",
      objectFit: "cover",
    }}
  />
) : (
  <div
    className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-4 mb-4"
    style={{ height: "180px" }}
  >
    {post.icon ? (
      <i className={`bi ${post.icon} display-3`}></i>
    ) : (
      <i className="bi bi-file-text display-3"></i>
    )}
  </div>
)}


          <p className="text-secondary lh-lg mb-4">
            {post.excerpt}
          </p>

          <div className="lh-lg">
            {post.content
              ?.split(/\r?\n/)
              .filter((paragraph) => paragraph.trim() !== "")
              .map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
          </div>

          <hr className="my-5" />

          <Link to="/blog" className="btn btn-outline-primary">
            <i className="bi bi-arrow-right me-2"></i>
            بازگشت به وبلاگ
          </Link>
        </article>
      </section>
    </>
  );
}
