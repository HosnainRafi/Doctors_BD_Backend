import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret";

export function signJwt(
  payload: object,
  expiresIn: string | number = "7d"
): string {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, JWT_SECRET, options);
}
