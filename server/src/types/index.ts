export interface IUser {
  username: string;
  password: string;
  avatar?: string;
  admin: boolean;
  favoritePosts: object[];
  favoriteArtists: string[];
  favoriteTags: string[];
}

export interface IArtist {
  name: string;
}

export interface ITag {
  name: string;
}

export interface IPost {
  artists: string[];
  name: string;
  tags: string[];
  uploader: string;
  width: number;
  height: number;
  type: string;
  source: string;
  nsfw: boolean;
  hidden: boolean;
  anonymous: boolean;
}
