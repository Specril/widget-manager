import { useState, useEffect } from "react";
import { usePercentageContext } from "../context/PercentageContext";
import { Link } from "react-router-dom";
import { fetchAllWidgets, fetchWidgetsByPage, deleteWidget } from "../api/api";
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
    const loadWidgets = async () => {
      const widgetsData = await fetchAllWidgets();

      if (Object.keys(widgetsData).length === 0) return; // No data

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
      setPageToPercentage(pageMap); // Update context globally
    };

    loadWidgets();
  }, [setPageToPercentage]);

  // Fetch widgets for the selected page
  useEffect(() => {
    const loadPageWidgets = async () => {
      const widgetsData = await fetchWidgetsByPage(pageName);
      if (pageName === "All") {
        const allWidgets = Object.values(widgetsData)
          .flat()
          .filter((item) => typeof item === "object");
        setWidgets(allWidgets);
      } else {
        setWidgets(widgetsData);
      }
    };

    loadPageWidgets();
  }, [pageName]);

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

  // Handle widget deletion
  const handleDelete = async (widgetToDelete) => {
    const success = await deleteWidget(widgetToDelete);
    if (!success) return;

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

    // Check if any widgets remain for this page
    const hasWidgetsRemaining = updatedWidgets.some(
      (widget) => widget.page_name === widgetToDelete.page_name
    );

    // Remove page name if no widgets are left
    if (!hasWidgetsRemaining) {
      setPageNames((prevPageNames) =>
        prevPageNames.filter((name) => name !== widgetToDelete.page_name)
      );
      setPageName("All"); // Reset to 'All' if the page was removed
    }
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
