import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import NavBar from "./components/navbar";
import Upload from "./pages/Upload/Upload";
import Gallery from "./pages/Gallery/Gallery";
import Post from "./pages/Post/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import { PersistLogin } from "./components/PersistLogin";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import axios from "./utils/axios.config";

function App() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios
      .get("/roles", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        setRoles(res.data);
      })
      .catch((error) => {});

    return () => {};
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route element={<PersistLogin />}>
          <Route path="/" element={<NavBar />}>
            {/** Public routes */}
            <Route index element={<Home />} />
            <Route path="browse" element={<Gallery />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="post/:post_id" element={<Post />} />

            {/** Private routes */}
            <Route
              element={
                <RequireAuth
                  allowedRoles={[
                    ...roles.map((role) =>
                      role.name === "User" ? role._id : null
                    ),
                  ]}
                />
              }
            >
              <Route path="upload" element={<Upload />} />
            </Route>

            {/** 404 */}
            {/* <Route path="*" element={<NoMatch />} /> */}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
