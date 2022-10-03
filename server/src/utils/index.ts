import * as express from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create and return hash
export function Hash(pwd: string): string {
  const ENV_SALT = process.env.ENCRYPT_SALT_LEVEL as string;
  const saltLevel = parseInt(ENV_SALT);
  const hash = bcrypt.hashSync(pwd, saltLevel);
  return hash;
}

// Create and return JWT Token
export function GenerateToken(data: any): string {
  const TOKEN_SECRET = process.env.ENCRYPT_TOKEN_SECRET as string;
  const expiresIn = process.env.ENCRYPT_TOKEN_EXPIRES_IN + " days";
  const token = jwt.sign(data, TOKEN_SECRET, { expiresIn });
  return token;
}

// Compare and return if string matches or not
export function CompareSync(pwd: string, pwdToCompare: string): boolean {
  const SECRET = process.env.ENCRYPT_SECRET as string;
  const isMatch = bcrypt.compareSync(pwd, pwdToCompare);
  return isMatch;
}

export function ValidateToken(token: string): any {
  try {
    const TOKEN_SECRET = process.env.ENCRYPT_TOKEN_SECRET as string;
    const tokenToValidate = token.replace("Bearer ", "");
    const user = jwt.verify(tokenToValidate, TOKEN_SECRET);
    return user;
  } catch (err) {
    console.error(err);
  }

  return null;
}

export function CheckAuthorization(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = _req.headers.authorization || "";
  const user = ValidateToken(token);

  if (!user) {
    res.status(400).send("Private route");
  } else {
    next();
  }
}
