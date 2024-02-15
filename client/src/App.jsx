import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";

const App = () => {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs/create" element={<CreateJob />} />
                <Route path="/jobs/edit/:id" element={<EditJob />} />
            </Routes>
        </div>
    );
};

export default App;
