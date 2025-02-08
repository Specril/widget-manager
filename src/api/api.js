import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; // Flask API URL

/* ========== WidgetList ========== */

// Fetch all widgets from the API
export const fetchAllWidgets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/widgets`);
    return response.data || {}; // Return empty object if invalid
  } catch (error) {
    console.error("Error fetching all widgets:", error);
    return {};
  }
};

// Fetch widgets for a specific page
export const fetchWidgetsByPage = async (pageName) => {
  try {
    if (pageName === "All") {
      return await fetchAllWidgets();
    }

    const response = await axios.get(`${API_BASE_URL}/widget/${pageName}`);
    return Array.isArray(response.data) ? response.data : [response.data]; // Ensure array format
  } catch (error) {
    console.error(`Error fetching widgets for ${pageName}:`, error);
    return [];
  }
};

// Delete a widget by page name and widget ID
export const deleteWidget = async (widgetToDelete) => {
  try {
    await axios.delete(
      `${API_BASE_URL}/widget/${widgetToDelete.page_name}/${widgetToDelete.id}`
    );
    return true;
  } catch (error) {
    console.error("Error deleting widget:", error);
    return false;
  }
};

/* ========== EditWidget ========== */

// Fetch a specific widget by ID
export const fetchWidgetById = async (pageName, widgetId) => {
  try {
    const widgets = await fetchWidgetsByPage(pageName);
    return widgets.find((widget) => widget.id === widgetId) || null;
  } catch (error) {
    console.error(`Error fetching widget ${widgetId} on ${pageName}:`, error);
    return null;
  }
};

// Fetch all widget IDs to check for uniqueness
export const fetchAllWidgetIds = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/widgets`);
    const widgetsData = response.data || {};

    const allIds = Object.values(widgetsData)
      .flat()
      .map((widget) => widget.id);

    return new Set(allIds); // Return a Set for quick lookup
  } catch (error) {
    console.error("Error fetching widget IDs:", error);
    return new Set();
  }
};

// Update a widget
export const updateWidget = async (
  oldPage,
  newPage,
  widgetId,
  updatedWidget
) => {
  try {
    // If the page has changed, delete from the old page and add to the new one
    if (oldPage !== newPage) {
      await axios.delete(`${API_BASE_URL}/widget/${oldPage}/${widgetId}`);
      await axios.post(`${API_BASE_URL}/widget`, updatedWidget);
    } else {
      await axios.put(
        `${API_BASE_URL}/widget/${oldPage}/${widgetId}`,
        updatedWidget
      );
    }

    return true;
  } catch (error) {
    console.error(`Error updating widget ${widgetId} on ${oldPage}:`, error);
    return false;
  }
};

/* ========== AddWidget ========== */

// Add a new widget
export const addWidget = async (newWidget) => {
  try {
    await axios.post(`${API_BASE_URL}/widget`, newWidget);
    return true;
  } catch (error) {
    console.error("Error adding widget:", error);
    return false;
  }
};
