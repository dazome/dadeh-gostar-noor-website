
import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/blog`;

const categories = [
  "شبکه و زیرساخت",
  "خدمات اکتیو شبکه",
  "خدمات پسیو شبکه",
  "پشتیبانی شبکه و IT",
  "سرور و مجازی‌سازی",
  "امنیت شبکه",
  "پشتیبان‌گیری و بازیابی اطلاعات",
  "ارتباطات سازمانی و VoIP",
  "طراحی سایت و توسعه وب",
  "تولید نرم‌افزار",
  "سخت‌افزار و تجهیزات IT",
  "آموزش و راهنماهای فناوری",
  "اخبار و فناوری‌های جدید",
  "سایر موضوعات",
];

const icons = [
  { name: "شبکه", value: "bi-diagram-3" },
  { name: "پشتیبانی", value: "bi-headset" },
  { name: "سرور", value: "bi-server" },
  { name: "امنیت", value: "bi-shield-check" },
  { name: "پشتیبان‌گیری", value: "bi-cloud-arrow-up" },
  { name: "ارتباطات", value: "bi-telephone" },
  { name: "طراحی سایت", value: "bi-code-slash" },
  { name: "نرم‌افزار", value: "bi-window-stack" },
  { name: "آموزش", value: "bi-book" },
  { name: "اخبار", value: "bi-newspaper" },
  { name: "پایگاه داده", value: "bi-database" },
  { name: "تجهیزات", value: "bi-pc-display" },
  { name: "فضای ابری", value: "bi-cloud" },
  { name: "ایده و راهنما", value: "bi-lightbulb" },
];

const createEmptyForm = () => ({
  title: "",
  slug: "",
  category: "",
  date: new Date().toLocaleDateString("en-CA"),
  excerpt: "",
  content: "",
  icon: "",
  image: null,
});

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(createEmptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [imageInputKey, setImageInputKey] = useState(0);

  useEffect(() => {
    if (!form.image) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(form.image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [form.image]);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("دریافت مطالب با خطا مواجه شد.");
      }

      const data = await response.json();
      setPosts(data);
    } catch {
      setError("دریافت مطالب وبلاگ با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!allowedImageTypes.includes(file.type)) {
      setError("فرمت تصویر باید JPG، PNG، WebP یا GIF باشد.");
      setForm((previous) => ({ ...previous, image: null }));
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");
      setForm((previous) => ({ ...previous, image: null }));
      e.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      image: file,
    }));
  };

  const openNewForm = () => {
    setEditingPostId(null);
    setExistingImage("");
    setForm(createEmptyForm());
    setImageInputKey((previous) => previous + 1);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);

    setForm({
      title: post.title || "",
      slug: post.slug || "",
      category: post.category || "",
      date: post.date ? String(post.date).slice(0, 10) : "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      icon: post.icon || "",
      image: null,
    });

    setExistingImage(post.image || "");
    setImageInputKey((previous) => previous + 1);
    setShowForm(true);
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingPostId(null);
    setExistingImage("");
    setImageInputKey((previous) => previous + 1);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("نشست ورود شما معتبر نیست. دوباره وارد شوید.");
      }

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("slug", form.slug.trim());
      formData.append("category", form.category);
      formData.append("date", form.date);
      formData.append("excerpt", form.excerpt.trim());
      formData.append("content", form.content.trim());
      formData.append("icon", form.icon);

      if (form.image) {
        formData.append("image", form.image);
      }

      const isEditing = editingPostId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingPostId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "ویرایش مطلب ناموفق بود."
              : "ایجاد مطلب ناموفق بود.")
        );
      }

      setMessage(
        isEditing
          ? "مطلب با موفقیت ویرایش شد."
          : "مطلب با موفقیت اضافه شد."
      );

      resetForm();
      await fetchPosts();
    } catch (error) {
      setError(error.message || "ارتباط با سرور برقرار نشد.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "از حذف این مطلب مطمئنی؟"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("نشست ورود شما معتبر نیست. دوباره وارد شوید.");
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حذف مطلب ناموفق بود.");
      }

      if (editingPostId === id) {
        resetForm();
      }

      setMessage("مطلب با موفقیت حذف شد.");
      await fetchPosts();
    } catch (error) {
      setError(error.message || "حذف مطلب ناموفق بود.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-2">مدیریت وبلاگ</h1>
          <p className="text-secondary mb-0">
            مطالب وبلاگ سایت را از این بخش مدیریت کن.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openNewForm}
        >
          <i className="bi bi-plus-lg ms-2"></i>
          افزودن مطلب
        </button>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h2 className="h5 fw-bold mb-4">
            {editingPostId !== null
              ? "ویرایش مطلب"
              : "افزودن مطلب جدید"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">عنوان مطلب *</label>
                <input
                  name="title"
                  className="form-control"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  آدرس مطلب (Slug) *
                </label>
                <input
                  name="slug"
                  className="form-control"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="network-security"
                  pattern="[a-zA-Z0-9-]+"
                  title="از حروف انگلیسی، اعداد و خط تیره استفاده کن."
                  required
                />
                <small className="text-secondary">
                  آدرس باید انگلیسی و بدون فاصله باشد.
                </small>
              </div>

              <div className="col-md-6">
                <label className="form-label">دسته‌بندی *</label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">تاریخ انتشار *</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">خلاصه مطلب *</label>
                <textarea
                  name="excerpt"
                  className="form-control"
                  rows="3"
                  value={form.excerpt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">متن کامل مطلب *</label>
                <textarea
                  name="content"
                  className="form-control"
                  rows="8"
                  value={form.content}
                  onChange={handleChange}
                  required
                />
                <small className="text-secondary">
                  برای جداکردن پاراگراف‌ها، بین آن‌ها خط خالی بگذار.
                </small>
              </div>

              <div className="col-12">
                <label className="form-label d-block">
                  آیکون مطلب (اختیاری)
                </label>

                <div className="row row-cols-3 row-cols-sm-4 row-cols-lg-7 g-2">
                  {icons.map((icon) => (
                    <div className="col" key={icon.value}>
                      <button
                        type="button"
                        className={`btn w-100 h-100 py-3 ${
                          form.icon === icon.value
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            icon:
                              previous.icon === icon.value
                                ? ""
                                : icon.value,
                          }))
                        }
                        aria-pressed={form.icon === icon.value}
                      >
                        <i
                          className={`bi ${icon.value} fs-4 d-block mb-2`}
                        ></i>
                        <small>{icon.name}</small>
                      </button>
                    </div>
                  ))}
                </div>

                <small className="text-secondary d-block mt-2">
                  برای انتخاب آیکون روی آن کلیک کن.
                </small>
              </div>

              <div className="col-12">
                <label className="form-label">
                  تصویر مقاله (اختیاری)
                </label>

                <input
                  key={imageInputKey}
                  type="file"
                  className="form-control"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageChange}
                />

                <small className="text-secondary d-block mt-2">
                  فرمت‌های مجاز: JPG، PNG، WebP و GIF؛ حداکثر حجم ۵ مگابایت.
                </small>

                {editingPostId !== null &&
                  existingImage &&
                  !form.image && (
                    <div className="mt-3">
                      <p className="small fw-semibold">
                        تصویر فعلی مقاله
                      </p>
                      <img
                        src={`${import.meta.env.VITE_API_URL || ""}${existingImage}`}
                        alt="تصویر فعلی مقاله"
                        className="img-thumbnail"
                        style={{
                          width: "240px",
                          height: "160px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}

                {imagePreview && (
                  <div className="mt-3">
                    <p className="small fw-semibold">
                      پیش‌نمایش تصویر جدید
                    </p>
                    <img
                      src={imagePreview}
                      alt="پیش‌نمایش تصویر مقاله"
                      className="img-thumbnail"
                      style={{
                        width: "240px",
                        height: "160px",
                        objectFit: "cover",
                      }}
                    />

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger d-block mt-2"
                      onClick={() => {
                        setForm((previous) => ({
                          ...previous,
                          image: null,
                        }));
                        setImageInputKey((previous) => previous + 1);
                      }}
                    >
                      لغو انتخاب تصویر جدید
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex gap-2 flex-wrap mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "در حال ذخیره..."
                  : editingPostId !== null
                    ? "ذخیره تغییرات"
                    : "ذخیره مطلب"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={saving}
                onClick={resetForm}
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-secondary">در حال دریافت مطالب...</p>
      ) : posts.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <i className="bi bi-file-text fs-1 text-secondary mb-3"></i>
          <h2 className="h5 fw-bold">هنوز مطلبی وجود ندارد</h2>
          <p className="text-secondary mb-0">
            برای شروع روی «افزودن مطلب» کلیک کن.
          </p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>عنوان</th>
                  <th>دسته‌بندی</th>
                  <th>تاریخ</th>
                  <th>عملیات</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="fw-semibold">
                      {post.icon && (
                        <i className={`bi ${post.icon} ms-2`}></i>
                      )}
                      {post.title}
                    </td>

                    <td>{post.category}</td>

                    <td>
                      {post.date
                        ? String(post.date).slice(0, 10)
                        : "-"}
                    </td>

                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(post)}
                        >
                          <i className="bi bi-pencil ms-1"></i>
                          ویرایش
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(post.id)}
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
        </div>
      )}
    </div>
  );
}
