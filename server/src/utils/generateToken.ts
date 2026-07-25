import jwt from "jsonwebtoken";
import { env } from "../config/env";

const generateToken = (
  id: string,
  role: string
): string => {
  return jwt.sign(
    {
      id,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;
