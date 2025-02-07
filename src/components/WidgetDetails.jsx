import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
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
      <p>{widget.id}</p>
      <p>{widget.page_name}</p>
      <p>{widget.price}</p>
      <p>{widget.showToPercentage}%</p>
      <p>{widget.text}</p>
      <img src={widget.thumbnail} alt="Widget Thumbnail" />
      <br />
    </>
  );
};

export default WidgetDetails;
