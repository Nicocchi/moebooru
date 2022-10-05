import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  Input,
  Switch,
  Tooltip,
  Progress,
  Spacer,
} from "@nextui-org/react";
import { FaTrash } from "react-icons/fa";

import "./index.css";
import axios from "../../utils/axios.config";

function Login() {
  return (
    <div className="Login">
      <Text h1>Login</Text>
      <div style={{ display: "flex", flexDirection: "column"}}>
        <Input clearable bordered labelPlaceholder="Username" />
        <Spacer />
        <Input.Password labelPlaceholder="Password" />
        <Spacer />
        <Button>Login</Button>
      </div>
    </div>
  );
}

export default Login;
