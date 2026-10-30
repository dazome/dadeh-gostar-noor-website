
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

const statusLabels = {
  new: "جدید",
  in_progress: "در حال پیگیری",
  completed: "انجام‌شده",
};

export default function Consultations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/admin/consultations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "دریافت درخواست‌ها ناموفق بود.");
      }

      setRequests(data);
    } catch (err) {
      setError(err.message || "ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/consultations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تغییر وضعیت انجام نشد.");
      }

      await loadRequests();
    } catch (err) {
      alert(err.message || "تغییر وضعیت انجام نشد.");
    }
  }

  async function deleteRequest(id) {
    if (!window.confirm("از حذف این درخواست مطمئن هستید؟")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/consultations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حذف درخواست انجام نشد.");
      }

      setRequests((previous) =>
        previous.filter((request) => request.id !== id)
      );
    } catch (err) {
      alert(err.message || "حذف درخواست انجام نشد.");
    }
  }

  return (
    <div className="container-fluid py-4" dir="rtl">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-2">درخواست‌های مشاوره</h1>
          <p className="text-secondary mb-0">
            مشاهده و پیگیری درخواست‌های ثبت‌شده در سایت
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadRequests}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise ms-2"></i>
          بروزرسانی
        </button>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "همه درخواست‌ها", count: requests.length },
          {
            label: "درخواست‌های جدید",
            count: requests.filter((item) => item.status === "new").length,
          },
          {
            label: "در حال پیگیری",
            count: requests.filter((item) => item.status === "in_progress").length,
          },
          {
            label: "انجام‌شده",
            count: requests.filter((item) => item.status === "completed").length,
          },
        ].map((item) => (
          <div className="col-6 col-xl-3" key={item.label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-secondary mb-2">{item.label}</p>
                <h2 className="h3 fw-bold mb-0">{item.count}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <p className="text-secondary mb-0">در حال دریافت درخواست‌ها...</p>
          ) : requests.length === 0 ? (
            <p className="text-secondary mb-0">
              هنوز درخواستی ثبت نشده است.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>مشخصات</th>
                    <th>خدمت</th>
                    <th>توضیحات</th>
                    <th>تاریخ ثبت</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="fw-semibold">{request.name}</div>
                        <a href={`tel:${request.phone}`} dir="ltr">
                          {request.phone}
                        </a>
                        {request.company && (
                          <div className="small text-secondary mt-1">
                            {request.company}
                          </div>
                        )}
                      </td>

                      <td>{request.service || "—"}</td>

                      <td style={{ minWidth: "180px", maxWidth: "300px" }}>
                        {request.description || "—"}
                      </td>

                      <td>
                        {new Date(request.createdAt).toLocaleString("fa-IR")}
                      </td>

                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={request.status}
                          aria-label={`وضعیت درخواست ${request.name}`}
                          onChange={(event) =>
                            updateStatus(request.id, event.target.value)
                          }
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteRequest(request.id)}
                        >
                          <i className="bi bi-trash ms-1"></i>
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
