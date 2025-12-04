import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./api";

export default function ResourceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    title: "",
    url: "",
    description: "",
    resourceType: "article",
    languageLevel: "beginner",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/resources/${id}`)
      .then((res) => setValues(res.data))
      .catch((err) => setMessage(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const e = {};
    if (!values.title || values.title.trim() === "")
      e.title = "Title is required";
    if (!values.url || values.url.trim() === "") e.url = "URL is required";
    else {
      try {
        new URL(values.url);
      } catch {
        e.url = "Enter a valid URL";
      }
    }
    if (!values.resourceType) e.resourceType = "Type is required";
    if (!values.languageLevel) e.languageLevel = "Level is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (id) {
        await api.put(`/api/resources/${id}`, values);
        const msg = "Resource updated successfully";
        // navigate back to resources list and show a flash message
        navigate("/resources", { state: { flash: msg } });
        return;
      } else {
        await api.post(`/api/resources`, values);
        const msg = "Resource created successfully";
        navigate("/resources", { state: { flash: msg } });
        return;
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{id ? "Edit Resource" : "Add Resource"}</h2>
      {message && <div style={{ marginBottom: 10 }}>{message}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 8 }}>
            <label>
              Title*
              <br />
              <input
                name="title"
                value={values.title}
                onChange={handleChange}
              />
            </label>
            {errors.title && <div style={{ color: "red" }}>{errors.title}</div>}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>
              URL*
              <br />
              <input name="url" value={values.url} onChange={handleChange} />
            </label>
            {errors.url && <div style={{ color: "red" }}>{errors.url}</div>}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>
              Description
              <br />
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </label>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>
              Type*
              <br />
              <select
                name="resourceType"
                value={values.resourceType}
                onChange={handleChange}
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="book">Book</option>
                <option value="course">Course</option>
              </select>
            </label>
            {errors.resourceType && (
              <div style={{ color: "red" }}>{errors.resourceType}</div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>
              Level*
              <br />
              <select
                name="languageLevel"
                value={values.languageLevel}
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            {errors.languageLevel && (
              <div style={{ color: "red" }}>{errors.languageLevel}</div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>
              {id ? "Update" : "Create"}
            </button>
            <button
              type="button"
              style={{ marginLeft: 8 }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
