/* import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const authenticateUser = async(req, res, next) => {
    let token;

  token = req.cookies.jwt
  
  if(token) {

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userId).select('-password')
      next()

    } catch (error) {
      return res.status(401).json({ msg: 'Not authorized, Invalid token'});
    }
  } else {
    res.status(401).json({msg: 'Not authorized'})
  }
}
 */

import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  console.log(token);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo;
    next();
  });
};
