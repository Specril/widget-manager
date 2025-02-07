import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePercentageContext } from "../context/PercentageContext"; // Import global context

function AddWidget() {
  const { pageToPercentage } = usePercentageContext(); // Get the current page percentages
  const [header, setHeader] = useState("");
  const [id, setId] = useState("");
  const [pageName, setPageName] = useState("homepage");
  const [price, setPrice] = useState("Free");
  const [showToPercentage, setShowToPercentage] = useState(0);
  const [text, setText] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isValidAddition, setIsValidAddition] = useState(true); // Checks if addition is allowed

  const navigate = useNavigate();

  // Check if the new percentage is valid
  const handlePercentageChange = (e) => {
    const newPercentage = Number(e.target.value);
    if (newPercentage >= 0) {
      setShowToPercentage(newPercentage);
    }

    // Get the current total for the selected page (default to 0 if not found)
    const currentTotal = pageToPercentage[pageName] || 0;
    const newTotal = currentTotal + newPercentage; // Predict total after addition

    setIsValidAddition(newTotal <= 100); // Disable submission if over 100%
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidAddition) {
      alert("The total ShowToPercentage for this page cannot exceed 100%.");
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

    axios
      .post("http://127.0.0.1:5000/widget", newWidget)
      .then(() => {
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
          min="0"
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

      <button type="submit" disabled={!isValidAddition}>
        Add Widget
      </button>
    </form>
  );
}

export default AddWidget;
