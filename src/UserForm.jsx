import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./api";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    subscription: "free",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/users/${id}`)
      .then((r) => setValues(r.data))
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const e = {};
    if (!values.username) e.username = "Username required";
    if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      e.email = "Valid email required";
    if (!id && (!values.password || values.password.length < 6))
      e.password = "Password (min 6 chars) required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (id) await api.put(`/api/users/${id}`, values);
      else await api.post(`/api/users`, values);
      const msg = id ? "User updated" : "User created";
      navigate("/users", { state: { flash: msg } });
      return;
    } catch (err) {
      setMessage(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  return (
    <div className="panel">
      <h2>{id ? "Edit User" : "Add User"}</h2>
      {message && <div>{message}</div>}
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Username</label>
          <input name="username" value={values.username} onChange={onChange} />
          {errors.username && (
            <div style={{ color: "red" }}>{errors.username}</div>
          )}
        </div>
        <div className="form-row">
          <label>Email</label>
          <input name="email" value={values.email} onChange={onChange} />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </div>
        <div className="form-row">
          <label>
            Password{" "}
            {id ? <span className="muted">(leave blank to keep)</span> : null}
          </label>
          <input
            name="password"
            value={values.password || ""}
            onChange={onChange}
            type="password"
          />
          {errors.password && (
            <div style={{ color: "red" }}>{errors.password}</div>
          )}
        </div>
        <div className="form-row">
          <label>Subscription</label>
          <select
            name="subscription"
            value={values.subscription}
            onChange={onChange}
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {id ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 8 }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
