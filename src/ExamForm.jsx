import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./api";

export default function ExamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    examType: "DELF",
    sections: "",
    difficulty: "",
    timer: 0,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/exams/${id}`)
      .then((r) => {
        const d = r.data;
        setValues({ ...d, sections: (d.sections || []).join(", ") });
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const e = {};
    if (!values.examType) e.examType = "Type required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...values,
        sections: values.sections
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        timer: Number(values.timer) || 0,
      };
      if (id) await api.put(`/api/exams/${id}`, payload);
      else await api.post("/api/exams", payload);
      const msg = id ? "Exam updated" : "Exam created";
      navigate("/exams", { state: { flash: msg } });
      return;
    } catch (err) {
      setMessage(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="panel">
      <h2>{id ? "Edit Exam" : "Add Exam"}</h2>
      {message && <div>{message}</div>}
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Exam Type</label>
          <select name="examType" value={values.examType} onChange={onChange}>
            <option value="DELF">DELF</option>
            <option value="TCF">TCF</option>
          </select>
          {errors.examType && (
            <div style={{ color: "red" }}>{errors.examType}</div>
          )}
        </div>

        <div className="form-row">
          <label>Sections (comma separated)</label>
          <input name="sections" value={values.sections} onChange={onChange} />
        </div>

        <div className="form-row">
          <label>Difficulty</label>
          <input
            name="difficulty"
            value={values.difficulty}
            onChange={onChange}
          />
        </div>

        <div className="form-row">
          <label>Timer (minutes)</label>
          <input
            name="timer"
            type="number"
            value={values.timer}
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
