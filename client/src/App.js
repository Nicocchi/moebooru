import "./App.css";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Home from "./pages/home/Home";
import NavBar from "./components/navbar";
import Upload from "./pages/Upload/Upload";
import Gallery from "./pages/Gallery/Gallery";
import Post from "./pages/Post/Post";

const GalleryLayout = () => {
  return <Outlet />;
};

function App({ Component }) {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="gallery" element={<Gallery />} />
          {/* <Route path="gallery" element={<GalleryLayout />}>
            <Route index element={<Gallery />} />
            <Route path=":tags" element={<Gallery />} />
          </Route> */}
          <Route path="post/:post_id" element={<Post />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
