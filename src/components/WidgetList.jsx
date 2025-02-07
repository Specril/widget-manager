import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import WidgetDetails from "./WidgetDetails";
import { FaPlus } from "react-icons/fa";

function WidgetList() {
  const [pageNames, setPageNames] = useState([]); // List of page names
  const [pageToPercentage, setPageToPercentage] = useState({}); // Mapping of page_name to sum of showToPercentage

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/widgets");
        const widgets = response.data;

        if (!widgets || typeof widgets !== "object") {
          console.error("Invalid API response structure:", widgets);
          return;
        }

        const pageMap = {};

        // Iterate through each page in the response
        Object.entries(widgets).forEach(([pageName, value]) => {
          // Ensure each value is an array
          const widgetsArray = Array.isArray(value) ? value : [value];
          // Sum the `showToPercentage` values
          const totalPercentage = widgetsArray.reduce((sum, widget) => {
            if (
              widget &&
              typeof widget === "object" &&
              "showToPercentage" in widget
            ) {
              return sum + (widget.showToPercentage || 0);
            } else {
              console.warn(`Skipping invalid widget:`, widget);
              return sum;
            }
          }, 0);

          // Store in the map
          pageMap[pageName] = totalPercentage;
        });

        setPageNames(Object.keys(pageMap)); // Set unique page names
        setPageToPercentage(pageMap); // Store mapping
      } catch (error) {
        console.error("Error fetching widgets:", error);
      }
    };

    fetchWidgets();
  }, []); // Runs only once when the component mounts

  const [widgets, setWidgets] = useState([]);
  const [pageName, setPageName] = useState("homepage"); // Default page
  const [totalShowToPercentage, setTotalShowToPercentage] = useState(0);
  const [percentageColor, setPercentageColor] = useState("black");

  // Fetch page widgets using the api
  useEffect(() => {
    if (pageName === "All") {
      axios.get("http://127.0.0.1:5000/widgets").then((response) => {
        const widgetsData = response.data;
        if (!widgetsData || typeof widgetsData !== "object") {
          console.error("Invalid API response structure:", widgetsData);
          return;
        }
        // Convert all widget values into a single array
        const allWidgets = Object.values(widgetsData)
          .flat() // Flatten the arrays and objects into a single list
          .filter((item) => typeof item === "object");
        setWidgets(allWidgets);
      });
    } else {
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
    }
  }, [pageName]); // Happens when we change the pageName

  const handleDelete = (widgetId) => {
    axios
      .delete(`http://127.0.0.1:5000/widget/${pageName}/${widgetId}`)
      .then((response) => {
        setWidgets(widgets.filter((widget) => widget.id !== widgetId));
      })
      .catch((error) => console.log(error));
  };

  function sumShowToPercentage(widgets) {
    return widgets.reduce(
      (total, widget) => total + (widget.showToPercentage || 0),
      0
    );
  }

  useEffect(() => {
    setTotalShowToPercentage(sumShowToPercentage(widgets));
    setPercentageColor(totalShowToPercentage > 100 ? "red" : "green");
  }, [widgets]);

  return (
    <div>
      <h1>Widgets for {pageName}</h1>
      <div className="page-selector">
        <select onChange={(e) => setPageName(e.target.value)} value={pageName}>
          <option value="All">All</option>
          {pageNames.length > 0 ? (
            pageNames.map((name) => (
              <option key={name} value={name}>
                {name.replace(/page$/, "").charAt(0).toUpperCase() +
                  name.replace(/page$/, "").slice(1)}{" "}
                {/* Formatting name */}
              </option>
            ))
          ) : (
            <option value="">Loading...</option>
          )}
        </select>
        <Link to="/add">
          <button disabled={totalShowToPercentage >= 100}>{<FaPlus />}</button>
        </Link>
        <p style={{ borderColor: percentageColor, color: percentageColor }}>
          {totalShowToPercentage}%
        </p>
      </div>
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
    </div>
  );
}

export default WidgetList;
