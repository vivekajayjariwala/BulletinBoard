import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  styleUrls: ["./error.component.css"],
  templateUrl: './error.component.html',
})
export class ErrorComponent {

  // Constructor function that is executed when an instance of the ErrorComponent is created. It uses dependency injection
  // to inject the MAT_DIALOG_DATA token and assigns it to the data property of type {message: string}. This allows the component
  // to receive data when it is opened as a dialog.
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {
  }

}
