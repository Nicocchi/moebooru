import { Outlet, Link } from "react-router-dom";
import { Text, Button } from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import {RabbitLogo} from "../Logo/Rabbit";

function NavBar() {
  const activeColor = "primary";
  const [activePage, setActivePage] = useState("");
  const location = useLocation();

  useEffect(() => {
    setActivePage(location.pathname);
    return () => {};
  }, [location]);

  return (
    <div>
      <div>
        <nav className="Navbar__container">
          <div className="Navbar__brand">
          <RabbitLogo fill="#ff557f" width={36} height={36}/>
            <Text b color="inherit" hideIn="xs">
              Moebooru
            </Text>
          </div>
          <div className="Navbar__content">
            <Link to="/" className="Navbar__link">
              <Text size="$lg" color={activePage == "/" ? "primary" : "white"}>
                Home
              </Text>
            </Link>
            <Link to="/upload" className="Navbar__link">
              <Text
                size="$lg"
                color={activePage == "/upload" ? "primary" : "white"}
              >
                Upload
              </Text>
            </Link>
            <Link to="/gallery" className="Navbar__link">
              <Text
                size="$lg"
                color={activePage == "/gallery" ? "primary" : "white"}
              >
                Gallery
              </Text>
            </Link>
          </div>
          <div className="Navbar__content">
            <Link to="/" className="Navbar__link">
              <Text>Login</Text>
            </Link>
            <Button auto flat as={Link} color={activeColor} href="/">
              Sign Up
            </Button>
          </div>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

export default NavBar;
