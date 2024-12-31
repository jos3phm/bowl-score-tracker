import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NewGame from "./pages/NewGame";
import Stats from "./pages/Stats";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/new-game" element={<NewGame />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;