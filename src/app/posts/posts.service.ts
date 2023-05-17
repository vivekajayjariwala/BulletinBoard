// Importing the required modules and libraries

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./posts.model";

// The "Injectable" decorator marks the class as injectable, allowing it to be used as a dependency
@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = []; // Private array property to store posts
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>(); // Private subject property for updating posts

  // Constructor function to initialize the class instance
  // It takes instances of the "HttpClient" and "Router" classes as parameters and assigns them to the "http" and "router" properties of the class, respectively
  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // Building the query parameters for pagination
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // Sending an HTTP GET request to the server API to fetch the posts
    // The URL includes the query parameters for pagination
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )


      .pipe(
        // Using the "map" operator to transform the response data
        // The response data is mapped to the "Post" model
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )


      .subscribe(transformedPostData => {
        // Updating the "posts" property with the transformed posts data
        this.posts = transformedPostData.posts;

        // Emitting the updated posts data using the "postsUpdated" subject
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    // Returning the "postsUpdated" subject as an observable
    // This allows components to subscribe and receive updates when the posts are modified
    return this.postsUpdated.asObservable();
  }

  // Sending an HTTP GET request to the server API to fetch a single post by its ID
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();   // Creating a new FormData object to hold the post data
    postData.append("title", title);   // Adding the "title" value to the FormData object
    postData.append("content", content);   // Adding the "content" value to the FormData object
    postData.append("image", image, title);   // Adding the "image" value to the FormData object with a filename
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",   // Sending an HTTP POST request to the server API endpoint for creating a new post
        postData   // Passing the FormData object as the request body
      )
      .subscribe(responseData => {
        this.router.navigate(["/explore"]);   // Navigating to the "/explore" route after the post is successfully created
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;   // Declaring a variable to hold the post data
    if (typeof image === "object") {
      postData = new FormData();   // Creating a new FormData object if the "image" value is of type "File"
      postData.append("id", id);   // Adding the "id" value to the FormData object
      postData.append("title", title);   // Adding the "title" value to the FormData object
      postData.append("content", content);   // Adding the "content" value to the FormData object
      postData.append("image", image, title);   // Adding the "image" value to the FormData object with a filename
    } else {
      postData = {   // Creating an object if the "image" value is of type "string"
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)   // Sending an HTTP PUT request to the server API endpoint for updating the post
      .subscribe(response => {
        this.router.navigate(["/explore"]);   // Navigating to the "/explore" route after the post is successfully updated
      });
  }
  // Sending an HTTP DELETE request to the server API endpoint for deleting a post by its ID
  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }
}
