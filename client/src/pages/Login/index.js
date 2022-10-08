import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Button,
  Text,
  Input,
  Switch,
  Tooltip,
  Progress,
  Spacer,
  Checkbox,
} from "@nextui-org/react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useToggle } from "../../hooks/useToggle";

import "./index.css";
import axios from "../../utils/axios.config";
const LOGIN_URL = "/login";

function Login() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  // const [username, setUsername] = useState("");
  const [username, setUsername] = useLocalStorage("username", "");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [check, toggleCheck] =  useToggle('persist', false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = (e) => {
    axios
      .post(LOGIN_URL, JSON.stringify({ username, password }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        const accessToken = res?.data?.accessToken;
        setAuth({ username, accessToken });
        setUsername("");
        setPassword("");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Username and password required");
        } else if (err.response?.status === 401) {
          setErrMsg("Username or password incorrect");
        } else {
          setErrMsg("Login Failed");
        }
        errRef.current.focus();
      });
  };

  return (
    <div className="Login">
      <Text h1>Login</Text>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit}
      >
        <Spacer />
        <Spacer />
        <Input
          clearable
          bordered
          labelPlaceholder="Username"
          ref={userRef}
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <Spacer />
        <Spacer />
        <Input.Password
          labelPlaceholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Spacer />
        <Text
          ref={errRef}
          className={errMsg ? "errMsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </Text>
        <Button onPress={handleSubmit}>Login</Button>
        <Spacer />
        <Checkbox isSelected={check} size="sm" onChange={toggleCheck}>
          Trust this device
        </Checkbox>
      </form>
    </div>
  );
}

export default Login;
