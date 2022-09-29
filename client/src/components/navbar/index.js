import { Outlet, Link } from "react-router-dom";
import { Text, Button } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { RabbitLogo } from "../Logo/Rabbit";
import customStyles from "../ReactSelect/SelectStyle";

function NavBar() {
  const activeColor = "primary";
  const [activePage, setActivePage] = useState("");
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActivePage(location.pathname);
    return () => {};
  }, [location]);

  const handleSearch = (value) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/tag?tag_name=${value}`)
      .then((res) => {
        if (res.data) {
          setTagOptions(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectSearch = (ev) => {
    if (ev.key === "Enter") {
      navigate(`/gallery?tags=${selectedOption.map((opt) => opt.label)}`);
    }
  };

  return (
    <div>
      <div>
        <nav className="Navbar__container">
          <div className="Navbar__brand">
            <RabbitLogo fill="#ff557f" width={36} height={36} />
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
            <Select
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              onInputChange={handleSearch}
              isSearchable
              isMulti
              placeholder="Search tags"
              options={tagOptions.map((opt) => ({
                label: opt.name,
                value: opt.name,
              }))}
              onKeyDown={handleSelectSearch}
              styles={customStyles}
              width="200px"
            />
            <Link to="/" className="Navbar__link" style={{marginLeft: "20px"}}>
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
