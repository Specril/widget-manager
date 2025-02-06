import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddWidget() {
  const [header, setHeader] = useState("");
  const [id, setId] = useState("");
  const [pageName, setPageName] = useState("homepage");
  const [price, setPrice] = useState("Free");
  const [showToPercentage, setShowToPercentage] = useState(0);
  const [text, setText] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newWidget = {
      header: header,
      id: id,
      page_name: pageName,
      price: price,
      showToPercentage: showToPercentage,
      text: text,
      thumbnail: thumbnail,
    };

    axios
      .post("http://127.0.0.1:5000/widget", newWidget)
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
          ID:
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
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

        <button type="submit">Add Widget</button>
      </form>
  );
}

export default AddWidget;
