
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

const emptyForm = {
  companyName: "",
  phone: "",
  email: "",
  address: "",
  postalCode: ""
};

function normalizeForm(data) {
  return {
    companyName: data?.companyName ?? "",
    phone: data?.phone ?? "",
    email: data?.email ?? "",
    address: data?.address ?? "",
    postalCode: data?.postalCode ?? ""
  };
}

export default function SiteInfo() {
  const [form, setForm] = useState(emptyForm);
  const [originalForm, setOriginalForm] = useState(emptyForm);
  const [hasRecord, setHasRecord] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSiteInfo() {
      try {
        const response = await fetch(`${API_URL}/api/site-info`);

        if (!response.ok) {
          throw new Error("دریافت اطلاعات شرکت ناموفق بود.");
        }

        const data = await response.json();

        if (data) {
          const normalized = normalizeForm(data);
          setForm(normalized);
          setOriginalForm(normalized);
          setHasRecord(true);
        } else {
          setForm(emptyForm);
          setOriginalForm(emptyForm);
          setHasRecord(false);
        }
      } catch (err) {
        setError(err.message || "خطا در دریافت اطلاعات.");
      } finally {
        setLoading(false);
      }
    }

    fetchSiteInfo();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("نشست مدیریت پیدا نشد. لطفاً دوباره وارد پنل شوید.");
      return;
    }

    // فقط فیلدهایی را انتخاب می‌کنیم که تغییر کرده‌اند.
    const changedFields = {};

    for (const key of Object.keys(emptyForm)) {
      if (form[key] !== originalForm[key]) {
        changedFields[key] = form[key];
      }
    }

    if (hasRecord && Object.keys(changedFields).length === 0) {
      setMessage("تغییری برای ذخیره وجود ندارد.");
      return;
    }

    if (!form.companyName.trim()) {
      setError("نام شرکت الزامی است.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/site-info`, {
        method: hasRecord ? "PATCH" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(hasRecord ? changedFields : form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "ذخیره اطلاعات ناموفق بود.");
      }

      const normalized = normalizeForm(data.siteInfo);

      setForm(normalized);
      setOriginalForm(normalized);
      setHasRecord(true);
      setMessage(data.message || "اطلاعات با موفقیت ذخیره شد.");
    } catch (err) {
      setError(err.message || "خطا در ذخیره اطلاعات.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="container py-5">در حال دریافت اطلاعات...</div>;
  }

  return (
    <div className="container py-4" dir="rtl">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-2">اطلاعات شرکت</h2>

          <p className="text-secondary mb-4">
            اطلاعات تماس و مشخصات شرکت را از این قسمت مدیریت کنید.
          </p>

          {message && (
            <div className="alert alert-success" role="status">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="companyName" className="form-label">
                نام شرکت *
              </label>

              <input
                id="companyName"
                name="companyName"
                type="text"
                className="form-control"
                value={form.companyName}
                onChange={handleChange}
                maxLength={255}
                required
              />

              <div className="form-text">
                در ثبت اولیه الزامی است؛ هنگام ویرایش، اگر تغییرش ندهید همان مقدار قبلی باقی می‌ماند.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                شماره تماس
              </label>

              <input
                id="phone"
                name="phone"
                type="text"
                className="form-control"
                value={form.phone}
                onChange={handleChange}
                maxLength={50}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                ایمیل
              </label>

              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                maxLength={255}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                آدرس
              </label>

              <textarea
                id="address"
                name="address"
                className="form-control"
                rows="3"
                value={form.address}
                onChange={handleChange}
                maxLength={1000}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="postalCode" className="form-label">
                کد پستی
              </label>

              <input
                id="postalCode"
                name="postalCode"
                type="text"
                className="form-control"
                value={form.postalCode}
                onChange={handleChange}
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
