export type PostResource = {
  id: string;
  author: PostAuthorResource;
  createdAt: Date;
  content: string;
};

export type PostAuthorResource = {
  id: string;
  username: string;
  name: string;
  imageUrl?: string;
  verified: boolean;
};
