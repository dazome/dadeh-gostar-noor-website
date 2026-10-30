
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog`);

        if (!response.ok) {
          throw new Error("دریافت مطالب ناموفق بود.");
        }

        const data = await response.json();
        setPosts(data);
      } catch {
        setError("دریافت مطالب وبلاگ با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <section className="bg-light py-5">
        <div className="container">
          <div className="text-center">
            <h1 className="fw-bold mb-3">وبلاگ</h1>

            <p className="text-secondary col-lg-6 mx-auto lh-lg mb-3">
              مطالب و نکات تخصصی در حوزه شبکه، زیرساخت، امنیت و فناوری اطلاعات
            </p>

            <div className="d-flex justify-content-center align-items-center gap-2 small">
              <Link to="/" className="text-decoration-none">
                صفحه اصلی
              </Link>

              <i className="bi bi-chevron-left text-secondary"></i>

              <span className="text-secondary">وبلاگ</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-lg-4">
          <div className="mb-5">
            <p className="text-primary fw-semibold mb-2">
              مطالب تخصصی
            </p>

            <h2 className="fw-bold mb-3">
              تازه‌ترین مطالب فناوری اطلاعات
            </h2>

            <p className="text-secondary lh-lg col-lg-7 mb-0">
              مجموعه‌ای از مطالب آموزشی و تخصصی در زمینه شبکه، امنیت،
              زیرساخت و راهکارهای فناوری اطلاعات.
            </p>
          </div>

          {loading && (
            <p className="text-secondary">در حال دریافت مطالب...</p>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && posts.length === 0 && (
            <p className="text-secondary">
              هنوز مطلبی برای نمایش وجود ندارد.
            </p>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="row g-4">
              {posts.map((post) => (
                <div className="col-md-6 col-lg-4" key={post.id}>
                  <article className="border rounded-4 overflow-hidden h-100 d-flex flex-column">
                    {post.image ? (
                      <img
                        src={`${API_URL}${post.image}`}
                        alt={post.title}
                        className="w-100"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary"
                        style={{ height: "220px" }}
                      >
                        <i
                          className={`bi ${
                            post.icon || "bi-file-text"
                          }`}
                          style={{ fontSize: "4rem" }}
                        ></i>
                      </div>
                    )}

                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-3 small flex-wrap">
                        <span className="text-primary fw-semibold">
                          {post.category}
                        </span>

                        <span className="text-secondary">•</span>

                        <span className="text-secondary">
                          {post.date
                            ? String(post.date).slice(0, 10)
                            : ""}
                        </span>
                      </div>

                      <h3 className="h5 fw-bold lh-base mb-3">
                        {post.title}
                      </h3>

                      <p className="text-secondary lh-lg mb-4">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-primary fw-semibold text-decoration-none"
                        >
                          مطالعه مطلب
                          <i className="bi bi-arrow-left me-2"></i>
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
