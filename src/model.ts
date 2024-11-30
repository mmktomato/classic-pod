export interface NavigationNode {
  name: string;
  command: () => Promise<void>;
  imageUri?: string;
}

export interface Song {
  name: string;
  // imageUri?: string; // TODO: Should be a buffer or blob.
  duration: number;
}

interface WithChildren<T> {
  children: T[];
}

export interface Album extends WithChildren<Song> {
  name: string;
}

export interface Artist extends WithChildren<Album> {
  name: string;
}
