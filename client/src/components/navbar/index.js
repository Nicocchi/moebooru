import { Outlet, Link } from "react-router-dom";
import { Text, Button, Dropdown, Avatar, User } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./index.css";
import { useEffect, useState } from "react";
import axios from "../../utils/axios.config";
import { RabbitLogo } from "../Logo/Rabbit";
import useAuth from "../../hooks/useAuth";
import { useLogout } from "../../hooks/useLogout";
import jwt_decode from "jwt-decode";
import customStyles from "../ReactSelect/SelectStyle";

function NavBar() {
  const activeColor = "primary";
  const [activePage, setActivePage] = useState("");
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const logout = useLogout();

  useEffect(() => {
    setActivePage(location.pathname);
    const decoded = auth?.accessToken
      ? jwt_decode(auth.accessToken)
      : undefined;
    if (decoded) setUsername(decoded.UserInfo.username);

    return () => {};
  }, [location]);

  const handleSearch = (value) => {
    axios
      .get(`/tags?tags=${value}`)
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
      setTagOptions([]);
      navigate(`/browse?tags=${selectedOption.map((opt) => opt.label)}`);
    }
  };

  const signOut = async (e) => {
    if (e === "logout") {
      await logout();
      console.log("ATU", auth);
      navigate("/");
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
            <Link to="/browse" className="Navbar__link">
              <Text
                size="$lg"
                color={activePage == "/browse" ? "primary" : "white"}
              >
                Browse
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
            {!auth.accessToken ? (
              <>
                <Link
                  to="/login"
                  className="Navbar__link"
                  style={{ marginLeft: "20px" }}
                >
                  <Text>Login</Text>
                </Link>
                <Button auto flat as={Link} color={activeColor} to="/register">
                  Sign Up
                </Button>
              </>
            ) : (
              <div style={{ marginLeft: "40px", marginRight: "20px" }}>
                <Dropdown placement="bottom-left">
                  <Dropdown.Trigger>
                    <User
                      bordered
                      as="button"
                      size="lg"
                      color="primary"
                      name={username}
                    />
                  </Dropdown.Trigger>
                  <Dropdown.Menu
                    color="primary"
                    aria-label="User Actions"
                    onAction={signOut}
                  >
                    <Dropdown.Item key="settings">
                      My Settings
                    </Dropdown.Item>
                    <Dropdown.Item key="logout" color="error" withDivider>
                      Log Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
          </div>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

export default NavBar;
