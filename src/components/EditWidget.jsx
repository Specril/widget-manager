import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditWidget() {
  const { pageName, widgetId } = useParams(); // Get pageName and widgetId from URL
  const [widget, setWidget] = useState(null); // Store the widget data
  const [header, setHeader] = useState("");
  const [id, setId] = useState("");
  const [price, setPrice] = useState("Free");
  const [showToPercentage, setShowToPercentage] = useState(0);
  const [text, setText] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const navigate = useNavigate();

  // Fetch all widgets for the given page
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/widget/${pageName}`)
      .then((response) => {
        const widgets = response.data;
        const widgetToEdit = widgets.find((widget) => widget.id === widgetId);
        if (widgetToEdit) {
          setWidget(widgetToEdit);
          setHeader(widgetToEdit.header);
          setId(widgetToEdit.id);
          setPrice(widgetToEdit.price);
          setShowToPercentage(widgetToEdit.showToPercentage);
          setText(widgetToEdit.text);
          setThumbnail(widgetToEdit.thumbnail);
        }
      })
      .catch((error) => console.log(error));
  }, [pageName, widgetId]); // Fetch widgets again if pageName or widgetId changes

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedWidget = {
      header,
      id,
      page_name: pageName,
      price,
      showToPercentage,
      text,
      thumbnail,
    };

    axios
      .put(
        `http://127.0.0.1:5000/widget/${pageName}/${widgetId}`,
        updatedWidget
      )
      .then(() => {
        navigate(`/`);
      })
      .catch((error) => console.log(error));
  };

  return widget ? (
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
        ID:
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      </label>
      <label>
        Page Name:
        <input
          type="text"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
        />
      </label>
      <label>
        Price:
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      <label>
        Show to Percentage:
        <input
          type="number"
          value={showToPercentage}
          onChange={(e) => setShowToPercentage(Number(e.target.value))}
        />
      </label>
      <label>
        Text:
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        Thumbnail:
        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </label>

      <button type="submit">Update Widget</button>
    </form>
  ) : (
    <p>Loading...</p>
  );
}

export default EditWidget;
