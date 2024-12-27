export type ViewType = "navigation" | "playback";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PanelView<TComponent extends React.ComponentType<any> = React.ComponentType<any>> {
  Component: TComponent;
  props: React.ComponentProps<TComponent>;
}

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
