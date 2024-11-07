interface TreeNode<T> {
  name: string;
  children?: T[];
}

export type DisplayNode = TreeNode<DisplayNode>;

export type ArtistNode = TreeNode<AlbumNode>;

export type AlbumNode = TreeNode<Song>;

export interface Song {
  name: string;
  imageUri?: string; // TODO: Should be a buffer or blob.
  duration: number;
}
