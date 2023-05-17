// interface that specifies the type of data in a Post object
// serves as a type of blueprint as to what data we use in the posting operations
// ensures that if we come back to this project later on or we are working on this as a team
// an error is thrown if someone tries adding different data
export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}
