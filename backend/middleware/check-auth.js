const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Extract the token from the authorization header
    const token = req.headers.authorization.split(" ")[1];
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    // Extract the user data from the decoded token and add it to the request object
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle authentication error by sending a 401 status code and an error message
    res.status(401).json({ message: "you are not authenticated!" });
  }
};
