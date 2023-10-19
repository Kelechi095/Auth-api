import jwt from "jsonwebtoken";

export const generateToken = (res, userID) => {
  const token = jwt.sign({ userId: userID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    /* secure: true /*
    sameSite: "none", */
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
