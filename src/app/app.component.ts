import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
@Component({
  selector: 'app-root', // Defining the selector for this component as 'app-root'
  templateUrl: './app.component.html', // Setting the template file for this component as './app.component.html'
  styleUrls: ['./app.component.css'] // Setting the style files for this component as ['./app.component.css']
})

export class AppComponent implements OnInit{
  // Calling the "autoAuthUser" method of the "authService" instance
  // This method is responsible for automatically authenticating the user
  constructor(private authService: AuthService) {
  }

  // Implementation of the "ngOnInit" method required by the "OnInit" interface
  // This method is called when the component is initialized
  // It is used for performing initialization tasks
  ngOnInit() {
    // Calling the "autoAuthUser" method of the "authService" instance
    // This method is responsible for automatically authenticating the user
    this.authService.autoAuthUser();
  }

}
