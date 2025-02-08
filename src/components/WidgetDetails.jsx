import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import ExpandableTextBox from "./ExpandableTextBox";

const WidgetDetails = ({ widget, onDelete }) => {
  const fallbackSrc =
    "https://cchsthevoice.org/wp-content/uploads/2024/05/02dv1ihoyb3a1.jpg";

  return (
    <>
      <div className="buttons">
        <button onClick={() => onDelete(widget)}>
          <FaTrashAlt />
        </button>
        <Link to={`/edit/${widget.page_name}/${widget.id}`}>
          <button>
            <FiEdit style={{ scale: 1.2 }} />
          </button>
        </Link>
      </div>
      <h3>{widget.header}</h3>
      <ExpandableTextBox text={widget.text} />
      <p>ID: {widget.id}</p>
      <p>Page: {widget.page_name}</p>
      <p>Price: {widget.price}</p>
      <p>Percent: {widget.showToPercentage}%</p>
      <img
        src={widget.thumbnail}
        alt="Widget Thumbnail"
        onError={(e) => (e.target.src = fallbackSrc)}
      />
      <br />
    </>
  );
};

export default WidgetDetails;
