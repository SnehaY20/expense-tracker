const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ERROR = require("../constants/errorMessages");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: ERROR.AUTH.NO_TOKEN });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: ERROR.AUTH.USER_NOT_FOUND });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: ERROR.AUTH.INVALID_TOKEN });
    }
  } catch (error) {
    return res.status(500).json({ message: ERROR.SERVER_ERROR });
  }
};

module.exports = auth;
