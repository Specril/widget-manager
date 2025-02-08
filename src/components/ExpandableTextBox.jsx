import { useState } from "react";

function ExpandableTextBox({ text }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      {!isExpanded ? (
        // Truncated Text
        <p className="text-p" onClick={() => setIsExpanded(true)}>
          {text}
        </p>
      ) : (
        // Scrollable Box
        <div style={{ position: "relative", display: "inline-block" }}>
          <div className="scrollable-box">{text}</div>
          <button className="close-button" onClick={() => setIsExpanded(false)}>
            ✖
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpandableTextBox;
