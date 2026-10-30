import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

const emptyForm = {
  title: "",
  description: "",
  file: null,
};

export default function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  const loadLicenses = useCallback(async () => {
    setLoading(true);
    setError("");

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
      setError(err.message || "ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLicenses();
  }, [loadLicenses]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFileKey((previous) => previous + 1);
  }

  function startEditing(license) {
    setEditingId(license.id);
    setForm({
      title: license.title,
      description: license.description || "",
      file: null,
    });

    setFileKey((previous) => previous + 1);
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("عنوان مجوز را وارد کنید.");
      return;
    }

    if (form.title.trim().length > 255) {
      setError("عنوان نباید بیشتر از ۲۵۵ کاراکتر باشد.");
      return;
    }

    if (form.description.length > 1000) {
      setError("توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description);

      if (form.file) {
        formData.append("file", form.file);
      }

      const url = editingId
        ? `${API_URL}/api/licenses/${editingId}`
        : `${API_URL}/api/licenses`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "ذخیره مجوز ناموفق بود."
        );
      }

      setMessage(data.message || "اطلاعات مجوز ذخیره شد.");

      resetForm();
      await loadLicenses();
    } catch (err) {
      setError(err.message || "ذخیره اطلاعات ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(license) {
    const confirmed = window.confirm(
      `آیا از حذف مجوز «${license.title}» مطمئن هستید؟`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/licenses/${license.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "حذف مجوز ناموفق بود."
        );
      }

      if (editingId === license.id) {
        resetForm();
      }

      setMessage(data.message || "مجوز حذف شد.");
      await loadLicenses();
    } catch (err) {
      setError(err.message || "حذف مجوز ناموفق بود.");
    }
  }

  function isPdf(filePath) {
    return filePath?.toLowerCase().endsWith(".pdf");
  }

  return (
    <div className="container-fluid py-4" dir="rtl">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-2">
          مدیریت مجوزها و گواهینامه‌ها
        </h1>

        <p className="text-secondary mb-0">
          مدارک شرکت را ثبت و اطلاعات آن‌ها را مدیریت کنید.
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
            {editingId ? "ویرایش مجوز" : "افزودن مجوز جدید"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-lg-6">
                <label
                  htmlFor="license-title"
                  className="form-label"
                >
                  عنوان مجوز *
                </label>

                <input
                  id="license-title"
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  maxLength={255}
                  required
                />
              </div>

              <div className="col-lg-6">
                <label
                  htmlFor="license-file"
                  className="form-label"
                >
                  فایل مدرک (اختیاری)
                </label>

                <input
                  key={fileKey}
                  id="license-file"
                  type="file"
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  onChange={(event) => {
                    const file =
                      event.target.files?.[0] || null;

                    if (
                      file &&
                      file.size > 5 * 1024 * 1024
                    ) {
                      setError(
                        "حجم فایل نباید بیشتر از ۵ مگابایت باشد."
                      );

                      event.target.value = "";

                      setForm((previous) => ({
                        ...previous,
                        file: null,
                      }));

                      return;
                    }

                    setError("");

                    setForm((previous) => ({
                      ...previous,
                      file,
                    }));
                  }}
                />

                <div className="form-text">
                  JPG، PNG، WebP، GIF یا PDF؛ حداکثر ۵ مگابایت.
                  {editingId &&
                    " برای نگه‌داشتن فایل قبلی، فایل جدید انتخاب نکنید."}
                </div>
              </div>

              <div className="col-12">
                <label
                  htmlFor="license-description"
                  className="form-label"
                >
                  توضیحات
                </label>

                <textarea
                  id="license-description"
                  className="form-control"
                  rows={3}
                  maxLength={1000}
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="توضیحات مربوط به مجوز یا گواهینامه..."
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "در حال ذخیره..."
                    : editingId
                      ? "ذخیره تغییرات"
                      : "افزودن مجوز"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    لغو ویرایش
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
            <h2 className="h5 fw-bold mb-0">
              فهرست مجوزها
            </h2>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={loadLicenses}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise ms-1"></i>
              بروزرسانی
            </button>
          </div>

          {loading ? (
            <p className="text-secondary">
              در حال دریافت اطلاعات...
            </p>
          ) : licenses.length === 0 ? (
            <p className="text-secondary mb-0">
              هنوز مجوزی ثبت نشده است.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>مدرک</th>
                    <th>عنوان</th>
                    <th>توضیحات</th>
                    <th>عملیات</th>
                  </tr>
                </thead>

                <tbody>
                  {licenses.map((license) => (
                    <tr key={license.id}>
                      <td style={{ minWidth: "100px" }}>
                        {license.filePath ? (
                          isPdf(license.filePath) ? (
                            <a
                              href={`${API_URL}${license.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary"
                            >
                              <i className="bi bi-file-earmark-pdf ms-1"></i>
                              مشاهده PDF
                            </a>
                          ) : (
                            <a
                              href={`${API_URL}${license.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`${API_URL}${license.filePath}`}
                                alt={license.title}
                                style={{
                                  width: "75px",
                                  height: "65px",
                                  objectFit: "contain",
                                }}
                              />
                            </a>
                          )
                        ) : (
                          <div
                            className="bg-light rounded d-flex align-items-center justify-content-center text-secondary"
                            style={{
                              width: "75px",
                              height: "65px",
                            }}
                          >
                            <i className="bi bi-file-earmark-text fs-3"></i>
                          </div>
                        )}
                      </td>

                      <td className="fw-medium">
                        {license.title}
                      </td>

                      <td style={{ minWidth: "180px" }}>
                        {license.description || "—"}
                      </td>

                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(license)}
                          >
                            <i className="bi bi-pencil ms-1"></i>
                            ویرایش
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(license)}
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
