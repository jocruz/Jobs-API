// Defines a new JavaScript class called CustomAPIError which extends the built-in Error class.
class CustomAPIError extends Error {
  // Constructor function that takes a message parameter.
  constructor(message) {
    // Calls the constructor of the Error class with the message parameter.
    super(message)
  }
}

// Exports the CustomAPIError class as a module, making it available for other modules to import and use.
module.exports = CustomAPIError
