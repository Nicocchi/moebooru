import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import NavBar from "./components/navbar";
import Upload from "./pages/Upload/Upload";
import Gallery from "./pages/Gallery/Gallery";
import Post from "./pages/Post/Post";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="browse" element={<Gallery />} />
          <Route path="post/:post_id" element={<Post />} />
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
