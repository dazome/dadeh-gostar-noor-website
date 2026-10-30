import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api`;

const dashboardLinks = [
  {
    title: "مدیریت مقالات",
    description: "افزودن و ویرایش مطالب وبلاگ",
    icon: "bi-file-text",
    to: "/admin/blog"
  },
  {
    title: "مدیریت مشتریان",
    description: "مدیریت مشتریان و لوگوها",
    icon: "bi-people",
    to: "/admin/customers"
  },
  {
    title: "مجوزها و گواهینامه‌ها",
    description: "مدیریت مدارک و مجوزها",
    icon: "bi-award",
    to: "/admin/licenses"
  },
  {
    title: "اطلاعات شرکت",
    description: "ویرایش اطلاعات تماس و شرکت",
    icon: "bi-building",
    to: "/admin/site-info"
  },
  {
    title: "درخواست‌های مشاوره",
    description: "مشاهده و پیگیری درخواست‌ها",
    icon: "bi-chat-dots",
    to: "/admin/consultations"
  }
];

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function StatCard({ title, value, icon, color, loading }) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-secondary">{title}</span>

            <div
              className={`rounded-3 bg-${color}-subtle text-${color} d-flex align-items-center justify-content-center`}
              style={{ width: 48, height: 48 }}
            >
              <i className={`bi ${icon} fs-4`} />
            </div>
          </div>

          <div className="fs-2 fw-bold">
            {loading ? (
              <span
                className="placeholder col-3"
                aria-label="در حال بارگذاری"
              />
            ) : (
              value.toLocaleString("fa-IR")
            )}
          </div>

          <div className="small text-secondary mt-2">
            مجموع ثبت‌شده در سیستم
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    customers: 0,
    licenses: 0,
    consultations: 0,
    newConsultations: 0
  });

  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("نشست شما معتبر نیست. لطفاً دوباره وارد پنل شوید.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const endpoints = [
          { key: "blogs", url: `${API_URL}/blog` },
          { key: "customers", url: `${API_URL}/customers` },
          { key: "licenses", url: `${API_URL}/licenses` },
          {
            key: "consultations",
            url: `${API_URL}/admin/consultations`
          }
        ];

        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            const response = await fetch(endpoint.url, {
              headers: {
                Authorization: `Bearer ${token}`
              },
              signal: controller.signal
            });

            if (response.status === 401 || response.status === 403) {
              throw new Error(
                "نشست شما منقضی شده یا معتبر نیست. لطفاً دوباره وارد شوید."
              );
            }

            if (!response.ok) {
              throw new Error(
                `دریافت اطلاعات ${endpoint.key} ناموفق بود.`
              );
            }

            return {
              key: endpoint.key,
              data: await response.json()
            };
          })
        );

        const data = Object.fromEntries(
          results.map((result) => [result.key, result.data])
        );

        const blogs = getList(data.blogs);
        const customers = getList(data.customers);
        const licenses = getList(data.licenses);
        const consultations = getList(data.consultations);

        const sortedConsultations = [...consultations].sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );

        setStats({
          blogs: blogs.length,
          customers: customers.length,
          licenses: licenses.length,
          consultations: consultations.length,
          newConsultations: consultations.filter(
            (item) => item.status === "new"
          ).length
        });

        setRecentConsultations(sortedConsultations.slice(0, 5));
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(
          err.message || "دریافت اطلاعات داشبورد با خطا مواجه شد."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, []);

  return (
    <div dir="rtl">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold fs-3 mb-2">داشبورد مدیریت</h1>
          <p className="text-secondary mb-0">
            به پنل مدیریت فناوری داده گستر نور خوش آمدید.
          </p>
        </div>

        <Link
          to="/admin/consultations"
          className="btn btn-primary"
        >
          <i className="bi bi-chat-dots ms-2" />
          بررسی درخواست‌ها
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>{error}</span>

          {error.includes("وارد شوید") && (
            <Link to="/admin/login" className="btn btn-outline-danger btn-sm">
              ورود مجدد
            </Link>
          )}
        </div>
      )}

      <div className="row g-3 mb-4">
        <StatCard
          title="مقالات"
          value={stats.blogs}
          icon="bi-file-text"
          color="primary"
          loading={loading}
        />

        <StatCard
          title="مشتریان"
          value={stats.customers}
          icon="bi-people"
          color="success"
          loading={loading}
        />

        <StatCard
          title="مجوزها و گواهینامه‌ها"
          value={stats.licenses}
          icon="bi-award"
          color="warning"
          loading={loading}
        />

        <StatCard
          title="درخواست‌های مشاوره"
          value={stats.consultations}
          icon="bi-chat-dots"
          color="info"
          loading={loading}
        />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48 }}
                >
                  <i className="bi bi-bell fs-4" />
                </div>

                <div>
                  <h2 className="h6 fw-bold mb-1">
                    درخواست‌های جدید مشاوره
                  </h2>
                  <p className="text-secondary small mb-0">
                    درخواست‌هایی که هنوز بررسی نشده‌اند
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <span className="fs-3 fw-bold">
                  {loading
                    ? "—"
                    : stats.newConsultations.toLocaleString("fa-IR")}
                </span>

                <Link
                  to="/admin/consultations"
                  className="btn btn-outline-primary btn-sm"
                >
                  مشاهده
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <h2 className="h5 fw-bold mb-0">
              آخرین درخواست‌های مشاوره
            </h2>

            <Link
              to="/admin/consultations"
              className="text-decoration-none small"
            >
              مشاهده همه
              <i className="bi bi-arrow-left me-2" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-secondary py-4">
              در حال دریافت اطلاعات...
            </div>
          ) : recentConsultations.length === 0 ? (
            <div className="text-center text-secondary py-4">
              هنوز درخواستی ثبت نشده است.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>نام</th>
                    <th>شماره تماس</th>
                    <th>خدمت موردنظر</th>
                    <th>تاریخ ثبت</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>

                <tbody>
                  {recentConsultations.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">
                        {item.name || "—"}
                      </td>

                      <td>{item.phone || "—"}</td>

                      <td>{item.service || "—"}</td>

                      <td className="text-nowrap">
                        {formatDate(item.createdAt)}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            item.status === "new"
                              ? "text-bg-primary"
                              : item.status === "in_progress"
                              ? "text-bg-warning"
                              : item.status === "completed"
                              ? "text-bg-success"
                              : "text-bg-secondary"
                          }`}
                        >
                          {item.status === "new"
                            ? "جدید"
                            : item.status === "in_progress"
                            ? "در حال پیگیری"
                            : item.status === "completed"
                            ? "تکمیل‌شده"
                            : "نامشخص"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <h2 className="h5 fw-bold mb-1">دسترسی سریع</h2>
        <p className="text-secondary small mb-0">
          بخش موردنظرت رو برای مدیریت انتخاب کن.
        </p>
      </div>

      <div className="row g-3">
        {dashboardLinks.map((item) => (
          <div className="col-12 col-md-6 col-xl-4" key={item.to}>
            <Link
              to={item.to}
              className="card border-0 shadow-sm h-100 text-decoration-none text-reset"
            >
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div
                  className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 48, height: 48 }}
                >
                  <i className={`bi ${item.icon} fs-4`} />
                </div>

                <div className="flex-grow-1">
                  <h3 className="h6 fw-bold mb-1">{item.title}</h3>
                  <p className="text-secondary small mb-0">
                    {item.description}
                  </p>
                </div>

                <i className="bi bi-chevron-left text-secondary" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
