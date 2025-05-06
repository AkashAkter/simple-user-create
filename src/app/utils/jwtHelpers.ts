import jwt from "jsonwebtoken";

export const jwtHelpers = {
  createToken: (
    payload: Record<string, unknown>,
    secret: string,
    expiresIn: string
  ): string => {
    return jwt.sign(payload, secret, {
      expiresIn,
    });
  },

  verifyToken: (token: string, secret: string) => {
    return jwt.verify(token, secret);
  },
};
