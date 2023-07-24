export type PostType = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type CreatePostType = Omit<PostType, 'id'>;
