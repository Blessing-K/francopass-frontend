import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./api";

export default function FeedbackForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({ userId: "", message: "", rating: 5 });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/feedback/${id}`)
      .then((r) => {
        const d = r.data || {};
        const userId =
          d.userId && typeof d.userId === "object"
            ? d.userId._id || d.userId.id || ""
            : d.userId;
        setValues({ ...d, userId });
      })
      .catch((e) => setMessage(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const e = {};
    if (!values.userId) e.userId = "User ID required";
    if (!values.message) e.message = "Message required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // ensure userId is a string id before sending
      const payload = {
        ...values,
        userId:
          typeof values.userId === "object"
            ? values.userId._id || values.userId.id || ""
            : values.userId,
      };
      if (id) await api.put(`/api/feedback/${id}`, payload);
      else await api.post("/api/feedback", payload);
      const msg = id ? "Feedback updated" : "Feedback created";
      navigate("/feedback", { state: { flash: msg } });
      return;
    } catch (err) {
      setMessage(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({
      ...v,
      [name]: name === "rating" ? Number(value) : value,
    }));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="panel">
      <h2>{id ? "Edit Feedback" : "Add Feedback"}</h2>
      {message && <div>{message}</div>}
      <form onSubmit={submit}>
        <div className="form-row">
          <label>User ID</label>
          <input name="userId" value={values.userId} onChange={onChange} />
          {errors.userId && <div style={{ color: "red" }}>{errors.userId}</div>}
        </div>
        <div className="form-row">
          <label>Message</label>
          <textarea name="message" value={values.message} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Rating</label>
          <input
            name="rating"
            type="number"
            value={values.rating}
            min={1}
            max={5}
            onChange={onChange}
          />
        </div>
        <div>
          <button className="btn btn-primary" type="submit">
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
