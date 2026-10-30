
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

const emptyForm = {
  name: "",
  logo: null,
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [logoKey, setLogoKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/customers`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "دریافت مشتریان ناموفق بود.");
      }

      setCustomers(data);
    } catch (err) {
      setError(err.message || "ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setLogoKey((previous) => previous + 1);
  }

  function startEditing(customer) {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      logo: null,
    });
    setLogoKey((previous) => previous + 1);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("نام مشتری را وارد کنید.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());

      if (form.logo) {
        formData.append("logo", form.logo);
      }

      const url = editingId
        ? `${API_URL}/api/customers/${editingId}`
        : `${API_URL}/api/customers`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "ذخیره مشتری ناموفق بود.");
      }

      setMessage(data.message || "اطلاعات مشتری ذخیره شد.");
      resetForm();
      await loadCustomers();
    } catch (err) {
      setError(err.message || "ذخیره اطلاعات ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(customer) {
    const confirmed = window.confirm(
      `آیا از حذف مشتری «${customer.name}» مطمئن هستید؟`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/customers/${customer.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حذف مشتری ناموفق بود.");
      }

      if (editingId === customer.id) {
        resetForm();
      }

      setMessage(data.message || "مشتری حذف شد.");
      await loadCustomers();
    } catch (err) {
      setError(err.message || "حذف مشتری ناموفق بود.");
    }
  }

  return (
    <div className="container-fluid py-4" dir="rtl">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-2">مدیریت مشتریان</h1>
        <p className="text-secondary mb-0">
          مشتریان نمایش‌داده‌شده در صفحه اصلی سایت را مدیریت کنید.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="h5 fw-bold mb-4">
            {editingId ? "ویرایش مشتری" : "افزودن مشتری جدید"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-lg-5">
                <label htmlFor="customer-name" className="form-label">
                  نام مشتری *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  maxLength={255}
                  required
                />
              </div>

              <div className="col-lg-5">
                <label htmlFor="customer-logo" className="form-label">
                  لوگو (اختیاری)
                </label>
                <input
                  key={logoKey}
                  id="customer-logo"
                  type="file"
                  className="form-control"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;

                    if (file && file.size > 5 * 1024 * 1024) {
                      setError("حجم لوگو نباید بیشتر از ۵ مگابایت باشد.");
                      event.target.value = "";
                      setForm((previous) => ({
                        ...previous,
                        logo: null,
                      }));
                      return;
                    }

                    setError("");
                    setForm((previous) => ({
                      ...previous,
                      logo: file,
                    }));
                  }}
                />
                <div className="form-text">
                  JPG، PNG، WebP یا GIF؛ حداکثر ۵ مگابایت.
                  {editingId && " برای حفظ لوگوی قبلی، فایل جدید انتخاب نکنید."}
                </div>
              </div>

              <div className="col-lg-2 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary flex-grow-1"
                  disabled={saving}
                >
                  {saving
                    ? "در حال ذخیره..."
                    : editingId
                      ? "ذخیره تغییرات"
                      : "افزودن"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    لغو
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h5 fw-bold mb-0">فهرست مشتریان</h2>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={loadCustomers}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise ms-1"></i>
              بروزرسانی
            </button>
          </div>

          {loading ? (
            <p className="text-secondary">در حال دریافت اطلاعات...</p>
          ) : customers.length === 0 ? (
            <p className="text-secondary mb-0">
              هنوز مشتری‌ای ثبت نشده است.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>لوگو</th>
                    <th>نام مشتری</th>
                    <th>عملیات</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td style={{ width: "100px" }}>
                        {customer.logo ? (
                          <img
                            src={`${API_URL}${customer.logo}`}
                            alt={`لوگوی ${customer.name}`}
                            style={{
                              width: "70px",
                              height: "55px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light rounded d-flex align-items-center justify-content-center text-secondary"
                            style={{ width: "70px", height: "55px" }}
                          >
                            <i className="bi bi-building fs-4"></i>
                          </div>
                        )}
                      </td>

                      <td className="fw-medium">{customer.name}</td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(customer)}
                          >
                            <i className="bi bi-pencil ms-1"></i>
                            ویرایش
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(customer)}
                          >
                            <i className="bi bi-trash ms-1"></i>
                            حذف
                          </button>
                        </div>
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
