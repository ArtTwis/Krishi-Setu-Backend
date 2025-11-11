export const attachRole = (role) => (req, res, next) => {
  if (req.body) {
    req.body.role = role;
  } else {
    req.role = role;
  }
  next();
};
