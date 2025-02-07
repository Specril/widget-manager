import { useState, useEffect } from "react";
import { usePercentageContext } from "../context/PercentageContext";
import { Link } from "react-router-dom";
import axios from "axios";
import WidgetDetails from "./WidgetDetails";
import { FaPlus } from "react-icons/fa";

function WidgetList() {
  const [pageNames, setPageNames] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [pageName, setPageName] = useState("All"); // Default to "All"
  const [totalShowToPercentage, setTotalShowToPercentage] = useState(0);

  // Access the global percentage context
  const { setPageToPercentage } = usePercentageContext();

  // Fetch all widgets & update context
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/widgets");
        const widgetsData = response.data;

        if (!widgetsData || typeof widgetsData !== "object") {
          console.error("Invalid API response:", widgetsData);
          return;
        }

        const pageMap = {};

        Object.entries(widgetsData).forEach(([name, value]) => {
          const widgetsArray = Array.isArray(value) ? value : [value];

          const totalPercentage = widgetsArray.reduce(
            (sum, widget) => sum + (widget.showToPercentage || 0),
            0
          );

          pageMap[name] = totalPercentage;
        });

        setPageNames(Object.keys(pageMap));
        setPageToPercentage(pageMap); //  Update context globally
      } catch (error) {
        console.error("Error fetching widgets:", error);
      }
    };

    fetchWidgets();
  }, [setPageToPercentage]); //  Ensures context is always updated

  // Fetch widgets for the selected page
  useEffect(() => {
    const fetchPageWidgets = async () => {
      if (pageName === "All") {
        axios.get("http://127.0.0.1:5000/widgets").then((response) => {
          const widgetsData = response.data;

          if (!widgetsData || typeof widgetsData !== "object") {
            console.error("Invalid API response:", widgetsData);
            return;
          }

          const allWidgets = Object.values(widgetsData)
            .flat()
            .filter((item) => typeof item === "object");

          setWidgets(allWidgets);
        });
      } else {
        axios
          .get(`http://127.0.0.1:5000/widget/${pageName}`)
          .then((response) => {
            setWidgets(
              Array.isArray(response.data) ? response.data : [response.data]
            );
          })
          .catch((error) => console.error(error));
      }
    };

    fetchPageWidgets();
  }, [pageName]); //  Runs when page changes

  // Update `totalShowToPercentage` whenever `widgets` change
  useEffect(() => {
    const sumShowToPercentage = widgets.reduce(
      (total, widget) => total + (widget.showToPercentage || 0),
      0
    );

    setTotalShowToPercentage(sumShowToPercentage);

    // Also update the context whenever `widgets` change
    setPageToPercentage((prev) => ({
      ...prev,
      [pageName]: sumShowToPercentage,
    }));
  }, [widgets, pageName, setPageToPercentage]);

  const handleDelete = (widgetToDelete) => {
    axios
      .delete(
        `http://127.0.0.1:5000/widget/${widgetToDelete.page_name}/${widgetToDelete.id}`
      )
      .then(() => {
        // Remove widget from local state
        const updatedWidgets = widgets.filter(
          (widget) => widget.id !== widgetToDelete.id
        );
        setWidgets(updatedWidgets);

        // Recalculate total percentage after deletion
        const newTotalPercentage = updatedWidgets.reduce(
          (total, widget) => total + (widget.showToPercentage || 0),
          0
        );

        // Update the global percentage context
        setPageToPercentage((prev) => ({
          ...prev,
          [pageName]: newTotalPercentage,
        }));

        if (updatedWidgets.length === 0) {
          setPageNames((prevPageNames) =>
            prevPageNames.filter((name) => name !== widgetToDelete.page_name)
          );
        }
      })
      .catch((error) => console.error("Error deleting widget:", error));
  };

  return (
    <>
      <h1>Widgets for {pageName}</h1>
      <div className="page-selector">
        <select onChange={(e) => setPageName(e.target.value)} value={pageName}>
          <option value="All">All</option>
          {pageNames.map((name) => (
            <option key={name} value={name}>
              {name.replace(/page$/, "").charAt(0).toUpperCase() +
                name.replace(/page$/, "").slice(1)}
            </option>
          ))}
        </select>
        <Link to="/add">
          <button disabled={pageName !== "All" && totalShowToPercentage >= 100}>
            <FaPlus />
          </button>
        </Link>
        {pageName !== "All" && <p>{totalShowToPercentage}%</p>}
      </div>
      <div>
        {widgets.map((widget) => (
          <div key={widget.id} className="card">
            <WidgetDetails
              widget={widget}
              onDelete={() => handleDelete(widget)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default WidgetList;
