// Importing the necessary modules and libraries
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PostListComponent} from "./posts/post-list/post-list.component";
import {PostCreateComponent} from "./posts/post-create/post-create.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from "./auth/auth.guard";

// routes are JS objects for which URL/parts of our app that is presented

const routes: Routes = [
// Defining the application routes
  {path: 'explore', component: PostListComponent}, // Setting the "PostListComponent" as the component to be displayed when the URL contains "/explore"
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]}, // Setting the "PostCreateComponent" as the component to be displayed when the URL contains "/create" and the "AuthGuard" is activated
  {path: 'login', component: LoginComponent}, // Setting the "LoginComponent" as the component to be displayed when the URL contains "/login"
  {path: 'signup', component: SignupComponent}, // Setting the "SignupComponent" as the component to be displayed when the URL contains "/signup"
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]}, // Setting the "PostCreateComponent" as the component to be displayed when the URL contains "/edit/:postId" and the "AuthGuard" is activated
// The ":postId" part of the path is a dynamic parameter that can take any value
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Registering the application routes using the "forRoot" method of the "RouterModule"
  exports: [RouterModule], // Exporting the "RouterModule" so it can be used in other modules
  providers: [AuthGuard] // Providing the "AuthGuard" as a service to be used by the routing system
})

export class AppRoutingModule {} // Exporting the "AppRoutingModule" class as the main routing module of the application
