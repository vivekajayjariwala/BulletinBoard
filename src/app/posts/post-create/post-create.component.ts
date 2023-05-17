import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PostsService } from "../posts.service";
import { Post } from "../posts.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Create a form group with form controls for title, content, and image.
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });

    // Subscribe to the route parameters to determine the mode (create or edit) and retrieve the post data if editing.
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        // Get the post data from the service based on the post ID.
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          // Assign the retrieved post data to the form controls.
          this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath, creator: postData.creator };
          this.form.setValue({ 'title': this.post.title, 'content': this.post.content, image: this.post.imagePath });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  // Handle the event when an image is picked by the user.
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // Update the value of the image form control with the selected file.
    this.form.patchValue({ image: file });
    // Update the validity of the image form control.
    this.form.get('image').updateValueAndValidity();

    // Convert the selected image file to a data URL to be used by the image tag for preview.
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Save the post when the "Save Post" button is clicked.
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      // Call the addPost function of the postsService to add a new post.
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      // Call the updatePost function of the postsService to update an existing post.
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    // Reset the form after saving the post.
    this.form.reset();
  }
}

