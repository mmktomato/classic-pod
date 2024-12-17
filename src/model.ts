export type ViewType = "navigation" | "playback";

export interface NavigationNode {
  name: string;
  command: () => Promise<void>;
  imageUri?: string;
}

export interface ArtistEntity {
  name: string;
}

export interface AlbumEntity {
  name: string;
  artist: string;
}

export interface SongEntity {
  name: string;
  album: string;
  artist: string;
}
