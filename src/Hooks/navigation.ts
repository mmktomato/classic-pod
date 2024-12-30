import { useState, useContext, useEffect, useCallback } from "react";

import {
  type SongEntity,
  type AlbumEntity,
  type ArtistEntity,
  type NavigationNode,
  type NavigationType,
} from "../model";
import { createMusicLibrary } from "../Modules/library";
import {
  openDb,
  getAllArtists,
  getArtistAlbums,
  deleteAllData,
  getAlbumSongs,
} from "../Modules/db";
import * as ls from "../Modules/localStorage";
import { topContext, topDispatchContext, type ActionType } from "../Modules/context";

// TODO: Remove this when `showDirectoryPicker` is available in TypeScript.
declare global {
  interface Window {
    // https://wicg.github.io/file-system-access/#api-showdirectorypicker
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
}

const isShowDirectoryPickerSupported = () => "showDirectoryPicker" in window;

const browseDirectory = async (): Promise<FileSystemDirectoryHandle> => {
  if (!isShowDirectoryPickerSupported()) {
    throw new Error("Directory picker is not supported.");
  }
  return await window.showDirectoryPicker();
};

const scanDirectory = async (rootDirectory: FileSystemDirectoryHandle) => {
  await openDb();
  await deleteAllData();
  await createMusicLibrary(rootDirectory);
};

export const createTopNavigation = (
  scaned: boolean,
  setScaned: (scaned: boolean) => void,
  allArtistsNavigation: NavigationNode,
) => {
  const scanNavigation: NavigationNode = {
    name: "Scan",
    handleSelect: async () => {
      try {
        const rootDirectory = await browseDirectory();

        // TODO: Show a loading spinner.
        setScaned(false);
        await scanDirectory(rootDirectory);
        setScaned(true);
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("Unknown error.");
        }
      }
    },
    handleBack: async () => {},
  };

  const topNavigation: NavigationNode[] = scaned
    ? [allArtistsNavigation, scanNavigation]
    : [scanNavigation];

  return topNavigation;
};

const toTop = async (
  scaned: boolean,
  setScaned: (scaned: boolean) => void,
  setSelectedIndex: (selectedIndex: number) => void,
  setNavigation: (navigation: NavigationNode[]) => void,
  setNavigationType: (navigationType: NavigationType) => void,
  dispatch: (action: ActionType) => void,
) => {
  const topNavigation = createTopNavigation(scaned, setScaned, {
    name: "Artists",
    handleSelect: /* top -> artists */ () =>
      toArtists(null, setSelectedIndex, setNavigation, setNavigationType, dispatch),
    handleBack: async () => {},
  });
  setSelectedIndex(0);
  setNavigation(topNavigation);
  setNavigationType("top");
};

const toArtists = async (
  selectedArtistName: string | null,
  setSelectedIndex: (selectedIndex: number) => void,
  setNavigation: (navigation: NavigationNode[]) => void,
  setNavigationType: (navigationType: NavigationType) => void,
  dispatch: (action: ActionType) => void,
) => {
  // TODO: sort
  const artists = await getAllArtists();

  const newIndex = Math.max(
    0,
    selectedArtistName ? artists.findIndex(artist => artist.name === selectedArtistName) : 0,
  );
  setSelectedIndex(newIndex);

  const artistsNavigation = artists.map<NavigationNode>(artist => ({
    name: artist.name,
    handleSelect: /* artists -> albums */ () =>
      toArtistAlbums(artist, null, setSelectedIndex, setNavigation, setNavigationType, dispatch),
    handleBack: /* artists -> top */ async () => setNavigationType("top"),
  }));
  setNavigation(artistsNavigation);
  setNavigationType("artists");
};

const toArtistAlbums = async (
  artist: ArtistEntity | string,
  selectedAlbum: AlbumEntity | null,
  setSelectedIndex: (selectedIndex: number) => void,
  setNavigation: (navigation: NavigationNode[]) => void,
  setNavigationType: (navigationType: NavigationType) => void,
  dispatch: (action: ActionType) => void,
) => {
  const artistName = typeof artist === "string" ? artist : artist.name;
  // TODO: sort
  const albums = await getArtistAlbums(artistName);

  const newIndex = Math.max(
    0,
    selectedAlbum ? albums.findIndex(album => album.name === selectedAlbum.name) : 0,
  );
  setSelectedIndex(newIndex);

  const albumsNavigation = albums.map<NavigationNode>(album => ({
    name: album.name,
    handleSelect: /* albums -> songs */ () =>
      toAlbumSongs(album, null, setSelectedIndex, setNavigation, setNavigationType, dispatch),
    handleBack: /* albums -> artists */ () =>
      toArtists(artistName, setSelectedIndex, setNavigation, setNavigationType, dispatch),
  }));
  setNavigation(albumsNavigation);
  setNavigationType("albums");
};

const toAlbumSongs = async (
  album: AlbumEntity,
  selectedSong: SongEntity | null,
  setSelectedIndex: (selectedIndex: number) => void,
  setNavigation: (navigation: NavigationNode[]) => void,
  setNavigationType: (navigationType: NavigationType) => void,
  dispatch: (action: ActionType) => void,
) => {
  // TODO: sort
  const songs = await getAlbumSongs(album);

  const newIndex = Math.max(
    0,
    selectedSong ? songs.findIndex(song => song.name === selectedSong.name) : 0,
  );
  setSelectedIndex(newIndex);

  const songsNavigation = songs.map<NavigationNode>(song => ({
    name: song.name,
    handleSelect: /* songs -> song */ async () => toSong(song, dispatch),
    handleBack: /* songs -> albums */ () =>
      toArtistAlbums(
        song.artist,
        album,
        setSelectedIndex,
        setNavigation,
        setNavigationType,
        dispatch,
      ),
  }));
  setNavigation(songsNavigation);
  setNavigationType("songs");
};

const toSong = (Song: SongEntity, dispatch: (action: ActionType) => void) => {
  dispatch({ type: "song", value: Song });
  dispatch({ type: "viewType", value: "playback" });
};

export const useNavigation = () => {
  const { scaned } = useContext(topContext);
  const dispatch = useContext(topDispatchContext);
  const [navigation, setNavigation] = useState<NavigationNode[]>([]);
  const [navigationType, setNavigationType] = useState<NavigationType>("top");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const setScaned = useCallback(
    (scaned: boolean) => {
      ls.setScaned(scaned);
      dispatch({ type: "scaned", value: scaned });
    },
    [dispatch],
  );

  useEffect(() => {
    if (navigationType === "top") {
      toTop(scaned, setScaned, setSelectedIndex, setNavigation, setNavigationType, dispatch);
    }
  }, [
    navigationType,
    scaned,
    setScaned,
    setSelectedIndex,
    setNavigation,
    setNavigationType,
    dispatch,
  ]);

  return { navigation, selectedIndex, setSelectedIndex };
};
