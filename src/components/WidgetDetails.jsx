import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const handleDelete = (widgetId, pageName) => {
  axios
    .delete(`http://127.0.0.1:5000/widget/${pageName}/${widgetId}`)
    .then((response) => {
      setWidgets(widgets.filter((widget) => widget.id !== widgetId));
    })
    .catch((error) => console.log(error));
};

const WidgetDetails = ({ widget, pageName }) => {
  return (
    <>
      <h3>{widget.header}</h3>
      <p>{widget.id}</p>
      <p>{widget.page_name}</p>
      <p>{widget.price}</p>
      <p>{widget.showToPercentage}%</p>
      <p>{widget.text}</p>
      <img src={widget.thumbnail} alt="Widget Thumbnail" />
      <br />
      <button onClick={() => handleDelete(widget.id)}>Delete</button>
      <Link to={`/edit/${pageName}/${widget.id}`}>
        <button>Edit</button>
      </Link>
    </>
  );
};

export default WidgetDetails;
