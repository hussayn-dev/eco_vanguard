const jwt = require("jsonwebtoken");

const createJwt = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const verifyJwt = (token) => jwt.verify(token, process.env.JWT_SECRET);

const sendCookies = (res, user, refreshToken) => {
  const access_token = createJwt(user);
  const refresh_token = createJwt({ refreshToken, user });

  //Expiry date for tokens
  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("access_token", access_token, {
    expires: new Date(Date.now() + oneDay),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  res.cookie("refresh_token", refresh_token, {
    expires: new Date(Date.now() + longerExp),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  sendCookies,
  verifyJwt,
};
