import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Subscribe to the authentication status changes
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      // Update the loading status
      this.isLoading = false;
    });
  }

  onSignup(form: NgForm) {
    // Check if the form is invalid
    if (form.invalid) {
      return;
    }
    // Call the createUser method in the auth service with the email and password values from the form
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    // Unsubscribe from the authentication status changes
    this.authStatusSub.unsubscribe();
  }
}
