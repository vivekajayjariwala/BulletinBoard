import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false; // Indicates whether the user is authenticated or not

  private authListenerSubs: Subscription; // Subscription object to handle authentication status changes

  constructor(private authService: AuthService) {
    // Injects the AuthService dependency
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth(); // Checks if the user is authenticated when the component initializes

    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated; // Updates the authentication status when changes occur

    });

  }

  onLogout() {
    this.authService.logout(); // Calls the logout method from the AuthService to log out the user

  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe(); // Unsubscribes from the authentication status listener when the component is destroyed
  }

}
