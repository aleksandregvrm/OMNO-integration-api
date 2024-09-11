const jwt = require("jsonwebtoken");
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_LIFETIME}`,
  });
  return token;
};
const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.name){
      return decoded; 
    }
  } catch (error) {
    console.error(error.message);
    return null; 
  }
};

module.exports = {createJWT,verifyJWT};
