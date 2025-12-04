import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./api";

export default function VocabForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    word: "",
    definition: "",
    exampleSentence: "",
    partOfSpeech: "",
    difficultyLevel: "beginner",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/vocab/${id}`)
      .then((r) => setValues(r.data))
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const e = {};
    if (!values.word) e.word = "Word required";
    if (!values.definition) e.definition = "Definition required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (id) await api.put(`/api/vocab/${id}`, values);
      else await api.post(`/api/vocab`, values);
      const msg = id ? "Vocab updated" : "Vocab created";
      navigate("/vocab", { state: { flash: msg } });
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="panel">
      <h2>{id ? "Edit Vocab" : "Add Vocab"}</h2>
      {message && <div>{message}</div>}
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Word</label>
          <input name="word" value={values.word} onChange={onChange} />
          {errors.word && <div style={{ color: "red" }}>{errors.word}</div>}
        </div>

        <div className="form-row">
          <label>Definition</label>
          <textarea
            name="definition"
            value={values.definition}
            onChange={onChange}
          />
        </div>

        <div className="form-row">
          <label>Example</label>
          <textarea
            name="exampleSentence"
            value={values.exampleSentence}
            onChange={onChange}
          />
        </div>

        <div className="form-row">
          <label>Part of speech</label>
          <input
            name="partOfSpeech"
            value={values.partOfSpeech}
            onChange={onChange}
          />
        </div>

        <div className="form-row">
          <label>Difficulty</label>
          <select
            name="difficultyLevel"
            value={values.difficultyLevel}
            onChange={onChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
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
