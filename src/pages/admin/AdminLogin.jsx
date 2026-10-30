import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("adminToken", data.token);

      navigate("/admin");

    } catch (error) {
      setError("ارتباط با سرور برقرار نشد.");
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">

      <div
        className="card border-0 shadow-sm rounded-4 p-4"
        style={{ maxWidth: "430px", width: "100%" }}
      >

        <div className="text-center mb-4">
          <h1 className="h3 fw-bold mb-2">
            پنل مدیریت
          </h1>

          <p className="text-secondary mb-0">
            ورود به پنل مدیریت فناوری داده گستر نور
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              ایمیل
            </label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dnoor.ir"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              رمز عبور
            </label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            ورود به پنل
          </button>

        </form>
      </div>

    </div>
  );
}