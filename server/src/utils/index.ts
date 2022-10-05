import * as express from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { User } from "models/User";

// Create and return hash
export function Hash(pwd: string): string {
  const ENV_SALT = process.env.ENCRYPT_SALT_LEVEL as string;
  const saltLevel = parseInt(ENV_SALT);
  const hash = bcrypt.hashSync(pwd, saltLevel);
  return hash;
}

// Create and return JWT Access Token
export function GenerateAccessToken(data: any): string {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
  const expiresIn = `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`;
  const accessToken = jwt.sign(data, ACCESS_TOKEN_SECRET, { expiresIn: expiresIn, });
  return accessToken;
}

// Create and return JWT Refresh Token
export function GenerateRefreshToken(data: any): string {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
  const expiresIn = `${process.env.REFRESH_TOKEN_EXPIRES_IN}d`;
  const refreshToken = jwt.sign(data, REFRESH_TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
  return refreshToken;
}

// Compare and return if string matches or not
export function CompareSync(pwd: string, pwdToCompare: string): boolean {
  const SECRET = process.env.ENCRYPT_SECRET as string;
  const isMatch = bcrypt.compareSync(pwd, pwdToCompare);
  return isMatch;
}

export function ValidateToken(token: string): any {
  try {
    const TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
    const tokenToValidate = token.replace("Bearer ", "");
    const user = jwt.verify(tokenToValidate, TOKEN_SECRET);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }

  return null;
}
