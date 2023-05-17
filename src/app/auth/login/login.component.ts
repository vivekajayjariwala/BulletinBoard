import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
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

  onLogin(form: NgForm) {
    // Check if the form is invalid
    if (form.invalid) {
      return;
    }
    // Call the login method in the auth service with the email and password values from the form
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    // Unsubscribe from the authentication status changes
    this.authStatusSub.unsubscribe();
  }
}
