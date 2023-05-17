// Importing the necessary modules and libraries
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler, HttpErrorResponse
} from "@angular/common/http"; // Importing the required HTTP-related classes from the "@angular/common/http" module
import {catchError, throwError} from "rxjs"; // Importing the "catchError" and "throwError" functions from the "rxjs" library
import {Injectable} from "@angular/core"; // Importing the "Injectable" decorator from the "@angular/core" module
import {MatDialog} from "@angular/material/dialog"; // Importing the "MatDialog" class from the Angular Material's dialog module
import {ErrorComponent} from "./error/error.component"; // Importing the "ErrorComponent" from the local file "./error/error.component"

@Injectable() // Applying the "Injectable" decorator to the class
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {
// Constructor function to initialize the class instance
// It takes an instance of the "MatDialog" class as a parameter and assigns it to the "dialog" property of the class
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
// Implementation of the "intercept" method required by the "HttpInterceptor" interface
// It takes an instance of the "HttpRequest" class and the "HttpHandler" interface as parameters
    return next.handle(req).pipe(catchError((error: HttpErrorResponse)=> {
      // Using the "pipe" method of the "next.handle(req)" observable to chain additional operators
      // The "catchError" operator is used to handle any errors that occur during the HTTP request

      let errorMessage = "an unknown error occurred!";
      // Initializing a variable to store the error message and setting it to a default value

      if (error.error.message){
        // Checking if the error object contains an "error" property with a "message" property
        // If it does, we assign the value of "error.error.message" to the "errorMessage" variable
        errorMessage = error.error.message;
      }

      this.dialog.open(ErrorComponent, {data: {message: errorMessage }});
      // Opening a dialog box by calling the "open" method of the "MatDialog" instance
      // The "ErrorComponent" is used as the content of the dialog box
      // The error message is passed to the component as data

      return throwError(error);
      // Throwing the error again to propagate it to the subscriber of the HTTP request
    }));

  }
}
