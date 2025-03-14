import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import MapPage from "./pages/MapPage";
import ParameterSelection from "./pages/ParameterSelection";

const App = () => {
  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/map-page" element={<MapPage/>} />
          <Route path="/parameter=page" element={<ParameterSelection/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;