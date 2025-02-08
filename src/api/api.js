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
