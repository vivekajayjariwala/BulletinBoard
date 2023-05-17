// Importing the necessary modules and libraries
const app = require("./backend/app"); // Importing the main application logic from the "app" file located in the "backend" directory
const debug = require("debug")("node-angular"); // Importing the "debug" library to enable debugging messages
const http = require("http"); // Importing the built-in "http" module for creating an HTTP server

// Function to normalize the port value
const normalizePort = val => {
  var port = parseInt(val, 10); // Parsing the provided value to an integer

  if (isNaN(port)) {
    // Checking if the port is not a number (NaN)
    // In this case, the value is likely a named pipe, so we return it as it is
    return val;
  }

  if (port >= 0) {
    // Checking if the port is a positive number
    // In this case, we return the port number
    return port;
  }

  return false; // Returning false if the port value is invalid
};

// Function to handle server errors
const onError = error => {
  if (error.syscall !== "listen") {
    // Checking if the error is related to the "listen" syscall
    // If it's not, we throw the error
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  // Determining the binding information based on the address and port values

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1); // Exiting the process with an error status code
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1); // Exiting the process with an error status code
      break;
    default:
      throw error; // Throwing the error if it's not a known error code
  }
};

// Function to handle the server listening event
const onListening = () => {
  const addr = server.address(); // Getting the server's address information
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  // Determining the binding information based on the address and port values

  debug("Listening on " + bind); // Outputting a debug message indicating the server is listening on the specified address/port
};

const port = normalizePort(process.env.PORT || "3000");
// Normalizing the provided port value by either using the value from the environment variable "PORT" or defaulting to "3000"
app.set("port", port); // Setting the port value in the application settings

const server = http.createServer(app); // Creating an HTTP server instance using the application logic
server.on("error", onError); // Registering the "onError" function as the error event handler for the server
server.on("listening", onListening); // Registering the "onListening" function as the listening event handler for the server
server.listen(port); // Starting the server and making it listen on the specified port
