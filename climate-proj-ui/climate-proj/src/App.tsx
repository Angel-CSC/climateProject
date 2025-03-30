import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CoordsProvider } from "./components/CoordsContext";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import MapPage from "./pages/MapPage";
import ParameterSelection from "./pages/ParameterSelection";
import Troll from "./pages/Troll";
import HowItWorks from "./pages/HowItWorks";
import Results from "./pages/Results";

const App = () => {
  return (
    <CoordsProvider>
      <Router>
        <NavBar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/map-page" element={<MapPage />} />
            <Route path="/parameter-page" element={<ParameterSelection />} />
            <Route path="/trolled" element={<Troll />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </CoordsProvider>
  );
};

export default App;
