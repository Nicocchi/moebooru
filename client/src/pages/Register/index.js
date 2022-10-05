import React, { useState } from "react";
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

function Register() {
  return (
    <div className="Register">
      <Text h1>Register</Text>
      <div style={{ display: "flex", flexDirection: "column"}}>
        <Input clearable bordered labelPlaceholder="Username" />
        <Spacer />
        <Input.Password labelPlaceholder="Password" />
        <Spacer />
        <Button>Create Account</Button>
      </div>
    </div>
  );
}

export default Register;
