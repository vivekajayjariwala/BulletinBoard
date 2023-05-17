import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

// The mimeType function is a custom validator used to check the MIME type of a file selected in a form control.

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  // Check if the value of the control is a string, indicating it's already a valid MIME type
  if (typeof control.value === "string") {
    return of(null); // Return an observable with a null value, indicating the MIME type is valid
  }
  const file = control.value as File; // Convert the control value to a File object
  const fileReader = new FileReader(); // Create a FileReader object to read the file
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      // Create an observable to handle the file read operation
      fileReader.addEventListener("loadend", () => {
        // Event listener for when the file reading is complete
        const arr = new Uint8Array(
          fileReader.result as ArrayBuffer
        ).subarray(0, 4); // Get the first 4 bytes of the file as an array
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16); // Convert each byte to a hexadecimal string and concatenate them
        }
        switch (header) {
          // Check the header against known MIME type signatures
          case "89504e47":
            isValid = true; // PNG image
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true; // JPEG image
            break;
          default:
            isValid = false; // Invalid MIME type
            break;
        }
        if (isValid) {
          observer.next(null); // Notify the observer with a null value, indicating the MIME type is valid
        } else {
          observer.next({ invalidMimeType: true }); // Notify the observer with an error object, indicating an invalid MIME type
        }
        observer.complete(); // Notify the observer that the validation is complete
      });
      fileReader.readAsArrayBuffer(file); // Read the file as an array buffer
    }
  );
  return frObs; // Return the observable representing the result of the MIME type validation
};
