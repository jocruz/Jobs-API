/**
 *  summary of what the errorHandlerMiddleware middleware does:
It receives an err object as input, which represents an error that occurred during the processing of a request.
It sets the default statusCode and msg properties of a customError object based on the err object's statusCode and message properties, or default values if those properties are not defined.
If the err object is an instance of the CustomAPIError class (or one of its subclasses), it returns an HTTP response with the err object's statusCode and message properties.
If the err object has a code property that is equal to 11000 (which is a MongoDB duplicate key error), it sets the msg and statusCode properties of the customError object to custom values, and returns an HTTP response with the custom error message and status code.
For all other errors, it returns an HTTP response with the default statusCode and msg properties of the customError object.
 */
const { CustomAPIError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default statusCode and message
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, // set to err.statusCode if defined, otherwise to INTERNAL_SERVER_ERROR
    msg: err.message || "Something went wrong try again later", // set to err.message if defined, otherwise to "Something went wrong try again later"
  };

  // if (err instanceof CustomAPIError) {
  //   // If err is an instance of CustomAPIError (or one of its subclasses, such as BadRequestError),
  //   // return its statusCode and message in the response to the client
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  if (err.name === "ValidationError") {
    // If the error name is "ValidationError", extract the error messages and join them together
    // to create a comma-separated string.
    // The error message has properties and well be accessing the errors property, and then getting the message property from the errors property.
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    
    // Set the status code to 400 Bad Request since this is typically the appropriate status code
    // for a validation error.
    customError.statusCode = 400;
  }
  
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
    console.log(err.keyValue); // { email: 'karen@gmail.com' }
  }

  // for all other errors, return the default custom error message and statusCode
  // return res.status(customError.statusCode).json({msg: customError.msg})
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
