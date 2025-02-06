import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditWidget() {
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");
  const [showToPercentage, setShowToPercentage] = useState(0);
  const { pageName, widgetId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/widget/${pageName}`)
      .then((response) => {
        const widget = response.data.find((w) => w.id === widgetId);
        if (widget) {
          setHeader(widget.header);
          setText(widget.text);
          setShowToPercentage(widget.showToPercentage);
        }
      })
      .catch((error) => console.log(error));
  }, [pageName, widgetId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedWidget = { header, text, showToPercentage };

    axios
      .put(
        `http://127.0.0.1:5000/widget/${pageName}/${widgetId}`,
        updatedWidget
      )
      .then((response) => {
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Header:
        <input
          type="text"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />
      </label>
      <label>
        Text:
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        Show to Percentage:
        <input
          type="number"
          value={showToPercentage}
          onChange={(e) => setShowToPercentage(Number(e.target.value))}
        />
      </label>
      <button type="submit">Update Widget</button>
    </form>
  );
}

export default EditWidget;
