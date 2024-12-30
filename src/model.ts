export type ViewType = "navigation" | "playback";
export type NavigationType = "top" | "artists" | "albums" | "songs";

interface PanelViewTypeBase<TView extends ViewType> {
  view: TView;
}
export interface NavigationPanelViewType extends PanelViewTypeBase<"navigation"> {
  navigation: NavigationType;
}
export type PlaybackPanelViewType = PanelViewTypeBase<"playback">;
export type PanelViewType = NavigationPanelViewType | PlaybackPanelViewType;

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
