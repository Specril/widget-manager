import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

const WidgetDetails = ({ widget, onDelete }) => {
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
      <p>{widget.text}</p>
      <p>ID: {widget.id}</p>
      <p>Page: {widget.page_name}</p>
      <p>Price: {widget.price}</p>
      <p>Percent: {widget.showToPercentage}%</p>
      <img src={widget.thumbnail} alt="Widget Thumbnail" />
      <br />
    </>
  );
};

export default WidgetDetails;
