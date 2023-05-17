/* interface that specifies the type of data in a Post object, which serves as a blueprint as to what data we use in a post
ensuring an error is thrown if different data is added */
export interface Post {
  id: string; // Property to store the unique identifier of the post
  title: string; // Property to store the title of the post
  content: string; // Property to store the content/body of the post
  imagePath: string; // Property to store the file path or URL of the post's image
  creator: string; // Property to store the username or ID of the post's creator
}
