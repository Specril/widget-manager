import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import WidgetDetails from "./WidgetDetails";

function WidgetList() {
  const [widgets, setWidgets] = useState([]);
  const [pageName, setPageName] = useState("homepage"); // Default page

  // Fetch page widgets using the api
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/widget/${pageName}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          // If there is more then one widget an array returns
          setWidgets(response.data);
        } else {
          // If it's only one we put it in an array for easy mapping
          setWidgets([response.data]);
        }
      })
      .catch((error) => console.log(error));
  }, [pageName]); // Happens when we change the pageName

  const handleDelete = (widgetId) => {
    axios
      .delete(`http://127.0.0.1:5000/widget/${pageName}/${widgetId}`)
      .then((response) => {
        setWidgets(widgets.filter((widget) => widget.id !== widgetId));
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Widgets for {pageName}</h1>
      <select onChange={(e) => setPageName(e.target.value)} value={pageName}>
        <option value="homepage">Home</option>
        <option value="aboutpage">About</option>
      </select>
      <div>
        {widgets.map((widget) => (
          <div key={widget.id} className="card">
            <WidgetDetails
              widget={widget}
              pageName={pageName}
              onDelete={handleDelete}
            ></WidgetDetails>
          </div>
        ))}
      </div>
      <Link to="/add">
        <button>Add New Widget</button>
      </Link>
    </div>
  );
}

export default WidgetList;
