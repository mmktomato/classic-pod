import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";

import { SongEntity, type AlbumEntity, type ArtistEntity, type NavigationNode } from "../model";
import { createMusicLibrary } from "../Modules/library";
import {
  openDb,
  getAllArtists,
  getArtistAlbums,
  deleteAllData,
  getAlbumSongs,
} from "../Modules/db";
import * as ls from "../Modules/localStorage";

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
  onNextNavigation: (navigation: NavigationNode[]) => void,
  onSongSelected: (song: SongEntity) => void,
) => {
  const scanNavigation: NavigationNode = {
    name: "Scan",
    command: async () => {
      try {
        const rootDirectory = await browseDirectory();

        // TODO: Show a loading spinner.
        ls.setScaned(false);
        setScaned(false);

        await scanDirectory(rootDirectory);

        ls.setScaned(true);
        setScaned(true);
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("Unknown error.");
        }
      }
    },
  };

  const topNavigation: NavigationNode[] = scaned
    ? [
        {
          name: "Artists",
          command: createAllArtistsCommand(onNextNavigation, onSongSelected),
        },
        scanNavigation,
      ]
    : [scanNavigation];

  return topNavigation;
};

const createAllArtistsCommand = (
  onNextNavigation: (navigation: NavigationNode[]) => void,
  onSongSelected: (song: SongEntity) => void,
) => {
  return async () => {
    console.log("All artists.");

    const artists = await getAllArtists();
    // TODO: sort
    const artistNavigation = artists.map<NavigationNode>(artist => ({
      name: artist.name,
      command: createArtistSelectCommand(artist, onNextNavigation, onSongSelected),
    }));
    onNextNavigation(artistNavigation);
  };
};

const createArtistSelectCommand = (
  artist: ArtistEntity,
  onNextNavigation: (navigation: NavigationNode[]) => void,
  onSongSelected: (song: SongEntity) => void,
) => {
  return async () => {
    console.log(`Select "${artist.name}"`);

    const albums = await getArtistAlbums(artist.name);
    // TODO: sort
    const navigation = albums.map<NavigationNode>(album => ({
      name: album.name,
      command: createAlbumSelectCommand(album, onNextNavigation, onSongSelected),
    }));
    onNextNavigation(navigation);
  };
};

const createAlbumSelectCommand = (
  album: AlbumEntity,
  onNextNavigation: (navigation: NavigationNode[]) => void,
  onSongSelected: (song: SongEntity) => void,
) => {
  return async () => {
    console.log(`Select "${album.name}"`);

    const songs = await getAlbumSongs(album);
    // TODO: sort
    const navigation = songs.map<NavigationNode>(song => ({
      name: song.name,
      command: createSongSelectCommand(song, onSongSelected),
    }));
    onNextNavigation(navigation);
  };
};

const createSongSelectCommand = (song: SongEntity, onSongSelected: (song: SongEntity) => void) => {
  return async () => {
    console.log(`Select "${song.name}"`);

    onSongSelected(song);
  };
};

export const onRotate = (
  e: ClickWheelerRotateEvent,
  navigation: NavigationNode[],
  selectedIndex: number,
): number => {
  if (!navigation.length) {
    return -1;
  }
  const lastIndex = navigation.length - 1;
  const nextIndex = Math.min(
    lastIndex,
    Math.max(0, selectedIndex + (e.detail.direction === "clockwise" ? 1 : -1)),
  );
  return nextIndex;
};

export const onTap = (
  e: ClickWheelerTapEvent,
  navigation: NavigationNode[],
  selectedIndex: number,
) => {
  console.log(e.detail.type, e.detail.tapArea);

  const selectedNode = navigation.at(selectedIndex);
  selectedNode?.command();
};
