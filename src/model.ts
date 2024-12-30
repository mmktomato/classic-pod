export type ViewType = "navigation" | "playback";
export type NavigationType = "top" | "artists" | "albums" | "songs";

export interface NavigationNode {
  name: string;
  handleSelect: () => Promise<void>;
  handleBack: () => Promise<void>;
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
