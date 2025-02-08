import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { usePercentageContext } from "../context/PercentageContext"; // Import global context

function EditWidget() {
  const { pageName, widgetId } = useParams(); // Get pageName and widgetId from URL
  const { pageToPercentage } = usePercentageContext(); // Get the global page percentages

  const [widget, setWidget] = useState(null);
  const [header, setHeader] = useState("");
  const [id, setId] = useState("");
  const [price, setPrice] = useState("Free");
  const [showToPercentage, setShowToPercentage] = useState(0);
  const [text, setText] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isValidUpdate, setIsValidUpdate] = useState(true); // Tracks if update is valid
  const [isValidAddition, setIsValidAddition] = useState(true); // Checks if addition is allowed

  const navigate = useNavigate();

  // Fetch all widgets for the given page
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/widget/${pageName}`)
      .then((response) => {
        let widgets = response.data;

        // Ensure `widgets` is always an array
        if (!Array.isArray(widgets)) {
          widgets = [widgets]; // Wrap single object in an array
        }

        // Find the widget to edit
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
      .catch((error) => console.error("Error fetching widgets:", error));
  }, [pageName, widgetId]); // Fetch widgets again if pageName or widgetId changes

  // Validate the new percentage before allowing update
  useEffect(() => {
    if (!pageToPercentage[pageName] || !widget) return;

    const currentTotal = pageToPercentage[pageName] || 0; // Get current total for the page
    const remainingPercentage = currentTotal - widget.showToPercentage; // Subtract the current widget's percentage
    const newTotal = remainingPercentage + showToPercentage; // Add new value

    setIsValidUpdate(newTotal <= 100); // Disable update if over 100%
  }, [showToPercentage, pageToPercentage, pageName, widget]);

  // Check if the new percentage is valid
  const handlePercentageChange = (e) => {
    const newPercentage = Number(e.target.value);

    if (newPercentage >= 0) {
      setShowToPercentage(newPercentage);
    }

    // Get the current total for the selected page (default to 0 if not found)
    const currentTotal = pageToPercentage[pageName] || 0;
    const newTotal =
      currentTotal - (widget?.showToPercentage || 0) + newPercentage; // Subtract old, add new

    setIsValidAddition(newTotal <= 100); // Disable submission if over 100%
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidUpdate) {
      alert("The total ShowToPercentage for this page cannot exceed 100%.");
      return;
    }

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
          required
          type="text"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />
      </label>
      <label>
        ID:
        <input
          required
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <label>
        Price:
        <input
          required
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      <label>
        Show to Percentage:
        <input
          required
          type="number"
          min="0"
          value={showToPercentage}
          onChange={handlePercentageChange}
        />
      </label>
      <p>
        Current Page Total: {pageToPercentage[pageName] || 0}% <br />
        New Total After Addition:{" "}
        {(pageToPercentage[pageName] || 0) -
          (widget?.showToPercentage || 0) +
          showToPercentage}
        %
      </p>
      {!isValidAddition && (
        <p style={{ color: "red" }}>Total percentage cannot exceed 100%.</p>
      )}
      <label>
        Text:
        <textarea
          required
          draggable={false}
          style={{ resize: "none" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <label>
        Thumbnail:
        <input
          required
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </label>

      <button type="submit" disabled={!isValidUpdate}>
        Update Widget
      </button>
    </form>
  ) : (
    <p>Loading...</p>
  );
}

export default EditWidget;
