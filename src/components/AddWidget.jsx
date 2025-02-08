import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePercentageContext } from "../context/PercentageContext";
import { fetchAllWidgetIds, addWidget } from "../api/api";

function AddWidget() {
  const { pageToPercentage } = usePercentageContext();
  const [header, setHeader] = useState("");
  const [id, setId] = useState("");
  const [pageName, setPageName] = useState("homepage");
  const [price, setPrice] = useState("Free");
  const [showToPercentage, setShowToPercentage] = useState(0);
  const [text, setText] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isValidAddition, setIsValidAddition] = useState(true);
  const [idError, setIdError] = useState("");
  const [allWidgetIds, setAllWidgetIds] = useState(new Set());

  const navigate = useNavigate();

  // Load all existing widget IDs for uniqueness check
  useEffect(() => {
    const loadAllIds = async () => {
      setAllWidgetIds(await fetchAllWidgetIds());
    };

    loadAllIds();
  }, []);

  // Handle ID change and check for uniqueness
  const handleIdChange = (e) => {
    const newId = e.target.value.trim();
    setId(newId);

    if (allWidgetIds.has(newId)) {
      setIdError("This ID is already taken. Please choose a different one.");
    } else {
      setIdError("");
    }
  };

  // Handle percentage change (Now updates correctly when pageName changes)
  const validatePercentage = (newPercentage, selectedPage) => {
    const currentTotal = pageToPercentage[selectedPage] || 0;
    const newTotal = currentTotal + newPercentage;

    setIsValidAddition(newTotal <= 100);
  };

  // Handle `showToPercentage` input change
  const handlePercentageChange = (e) => {
    const newPercentage = Number(e.target.value);
    if (newPercentage >= 0) {
      setShowToPercentage(newPercentage);
      validatePercentage(newPercentage, pageName);
    }
  };

  // Handle `pageName` input change
  const handlePageNameChange = (e) => {
    const newPageName = e.target.value.trim();
    setPageName(newPageName);
    validatePercentage(showToPercentage, newPageName); // Recalculate validity for the new page
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidAddition) {
      alert("The total ShowToPercentage for this page cannot exceed 100%.");
      return;
    }

    if (idError) {
      alert("Please choose a unique ID before submitting.");
      return;
    }

    const newWidget = {
      header,
      id,
      page_name: pageName,
      price,
      showToPercentage,
      text,
      thumbnail,
    };

    const success = await addWidget(newWidget);
    if (success) navigate(`/`);
  };

  return (
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
          value={pageName}
          onChange={handlePageNameChange}
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
        Current Page Total: {pageToPercentage[pageName] || 0}% <br />
        New Total After Addition:{" "}
        {(pageToPercentage[pageName] || 0) + showToPercentage}%
      </p>
      {!isValidAddition && (
        <p style={{ color: "red" }}>Total percentage cannot exceed 100%.</p>
      )}
      <label>
        Text:
        <textarea
          required
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
        Add Widget
      </button>
    </form>
  );
}

export default AddWidget;
