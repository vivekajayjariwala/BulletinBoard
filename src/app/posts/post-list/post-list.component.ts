import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // The @Input decorator allows the posts property to be bound via property binding, meaning it can receive data from its parent component
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  // The ngOnInit method is automatically executed when the component is initialized
  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage); // Fetches the initial posts
    this.userId = this.authService.getUserId(); // Retrieves the current user's ID
    // Subscribe to the post update listener to receive new posts and update the UI
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: { posts: Post[]; postCount: number }) => {
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth(); // Checks if the user is authenticated
    // Subscribe to the authentication status listener to update the user's authentication status and ID
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  // Called when the page is changed in the pagination control
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1; // Update the current page
    this.postsPerPage = pageData.pageSize; // Update the number of posts per page
    this.postsService.getPosts(this.postsPerPage, this.currentPage); // Fetch the posts for the new page
  }

  // Called when a post is deleted
  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage); // Fetch the updated posts after deletion
    });
  }

  // The ngOnDestroy method is called when the component is about to be destroyed, and it is used to clean up resources
  ngOnDestroy() {
    this.postsSub.unsubscribe(); // Unsubscribe from the post update listener
    this.authStatusSub.unsubscribe(); // Unsubscribe from the authentication status listener
  }
}
