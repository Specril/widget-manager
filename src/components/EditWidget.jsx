import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePercentageContext } from "../context/PercentageContext";
import { fetchWidgetById, fetchAllWidgetIds, updateWidget } from "../api/api";

function EditWidget() {
  const { pageName, widgetId } = useParams();
  const { pageToPercentage } = usePercentageContext();

  const [widget, setWidget] = useState(null);
  const [header, setHeader] = useState("");
  const [id, setId] = useState("");
  const [originalId, setOriginalId] = useState(""); // Store the original ID
  const [price, setPrice] = useState("Free");
  const [showToPercentage, setShowToPercentage] = useState(0);
  const [text, setText] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [currentPageName, setCurrentPageName] = useState(pageName);
  const [isValidAddition, setIsValidAddition] = useState(true);
  const [allWidgetIds, setAllWidgetIds] = useState(new Set());
  const [idError, setIdError] = useState("");

  const navigate = useNavigate();

  // Load widget data
  useEffect(() => {
    const loadWidget = async () => {
      const widgetToEdit = await fetchWidgetById(pageName, widgetId);
      if (widgetToEdit) {
        setWidget(widgetToEdit);
        setHeader(widgetToEdit.header);
        setId(widgetToEdit.id);
        setOriginalId(widgetToEdit.id);
        setPrice(widgetToEdit.price);
        setShowToPercentage(widgetToEdit.showToPercentage);
        setText(widgetToEdit.text);
        setThumbnail(widgetToEdit.thumbnail);
        setCurrentPageName(widgetToEdit.page_name);
      }
    };

    const loadAllIds = async () => {
      setAllWidgetIds(await fetchAllWidgetIds());
    };

    loadWidget();
    loadAllIds();
  }, [pageName, widgetId]);

  // Check if ID is unique
  const handleIdChange = (e) => {
    const newId = e.target.value.trim();
    setId(newId);

    if (newId !== originalId && allWidgetIds.has(newId)) {
      setIdError("This ID is already taken.");
    } else {
      setIdError("");
    }
  };

  // Handle showToPercentage change (Now Correctly Subtracts Old Value)
  const handlePercentageChange = (e) => {
    const newPercentage = Number(e.target.value);
    if (newPercentage >= 0) {
      setShowToPercentage(newPercentage);
    }

    // Get the current total for the selected page (default to 0 if not found)
    const currentTotal = pageToPercentage[currentPageName] || 0;
    const newTotal =
      currentTotal - (widget?.showToPercentage || 0) + newPercentage; // Subtract old, add new

    setIsValidAddition(newTotal <= 100); // Disable submission if over 100%
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidAddition) {
      alert("The total percentage for this page cannot exceed 100%.");
      return;
    }

    if (idError) {
      alert("Please choose a unique ID before submitting.");
      return;
    }

    const updatedWidget = {
      header,
      id,
      page_name: currentPageName,
      price,
      showToPercentage,
      text,
      thumbnail,
    };

    const success = await updateWidget(
      pageName,
      currentPageName,
      widgetId,
      updatedWidget
    );
    if (success) navigate(`/`);
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
        <input required type="text" value={id} onChange={handleIdChange} />
      </label>
      {idError && <p style={{ color: "red" }}>{idError}</p>}
      <label>
        Page Name:
        <input
          required
          type="text"
          value={currentPageName}
          onChange={(e) => setCurrentPageName(e.target.value)}
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
          min="0"
          max="100"
          type="number"
          value={showToPercentage}
          onChange={handlePercentageChange}
        />
      </label>
      <p>
        Current Page Total: {pageToPercentage[currentPageName] || 0}% <br />
        New Total After Addition:{" "}
        {(pageToPercentage[currentPageName] || 0) -
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

      <button type="submit" disabled={!isValidAddition || idError}>
        Update Widget
      </button>
    </form>
  ) : (
    <p>Loading...</p>
  );
}

export default EditWidget;
