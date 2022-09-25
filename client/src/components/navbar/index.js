import { Button } from "@nextui-org/react";
import { Outlet, Link } from "react-router-dom";

function NavBar({ Component }) {
  return (
    <div>
      <div>
        {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
        <nav>
          <ul style={{display: "flex"}}>
            <li style={{marginRight: "20px"}}>
              <Link to="/">Home</Link>
            </li>
            <li style={{marginRight: "20px"}}>
              <Link to="/upload">Upload</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
        </nav>

        <hr />

        {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
        <Outlet />
      </div>
    </div>
  );
}

export default NavBar;
