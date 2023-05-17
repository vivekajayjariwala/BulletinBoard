import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import { Post } from '../posts.model';
import {PostsService} from "../posts.service";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // make post property bindable via property binding using Input decorator
  // you can now bind posts only from direct parent
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}


  // ngOnInit will automatically execute so recommended to do initializations there
  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: { posts: Post[], postCount: number }) => {
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    // first argument is function executed whenever new data is submitted, second argument whenever error is emitted, third argument is whenever observable is completed but would also never happen
    // only first argument which is when function receives any new values
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();

    });
  }

  onChangedPage(pageData: PageEvent){

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage)
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });


  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
