import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WidgetList from "./components/WidgetList";
import AddWidget from "./components/AddWidget";
import EditWidget from "./components/EditWidget";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<WidgetList />} />
          <Route path="/add" element={<AddWidget />} />
          <Route path="/edit/:pageName/:widgetId" element={<EditWidget />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
