import { useEffect, useState } from "react";

import { SongEntity, type AlbumEntity, type ArtistEntity, type NavigationNode } from "./model";
import { createMusicLibrary } from "./Modules/library";
import { openDb, getAllArtists, getArtistAlbums, deleteAllData, getAlbumSongs } from "./Modules/db";
import * as ls from "./Modules/localStorage";

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

export const useNavigation = (onSongSelected: (song: SongEntity) => void) => {
  const [navigation, setNavigation] = useState<NavigationNode[]>([]);
  const [scaned, setScaned] = useState(ls.scaned());

  useEffect(() => {
    if (scaned) {
      // await openDb()
      openDb();
    }

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
            command: createAllArtistsCommand(setNavigation, onSongSelected),
          },
          scanNavigation,
        ]
      : [scanNavigation];
    setNavigation(topNavigation);
  }, [scaned, onSongSelected]);

  return { navigation };
};

const createAllArtistsCommand = (
  setNavigation: (navigation: NavigationNode[]) => void,
  onSongSelected: (song: SongEntity) => void,
) => {
  return async () => {
    console.log("All artists.");

    const artists = await getAllArtists();
    // TODO: sort
    const artistNavigation = artists.map<NavigationNode>(artist => ({
      name: artist.name,
      command: createArtistSelectCommand(artist, setNavigation, onSongSelected),
    }));
    setNavigation(artistNavigation);
  };
};

const createArtistSelectCommand = (
  artist: ArtistEntity,
  setNavigation: (navigation: NavigationNode[]) => void,
  onSongSelected: (song: SongEntity) => void,
) => {
  return async () => {
    console.log(`Select "${artist.name}"`);

    const albums = await getArtistAlbums(artist.name);
    // TODO: sort
    const navigation = albums.map<NavigationNode>(album => ({
      name: album.name,
      command: createAlbumSelectCommand(album, setNavigation, onSongSelected),
    }));
    setNavigation(navigation);
  };
};

const createAlbumSelectCommand = (
  album: AlbumEntity,
  setNavigation: (navigation: NavigationNode[]) => void,
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
    setNavigation(navigation);
  };
};

const createSongSelectCommand = (song: SongEntity, onSongSelected: (song: SongEntity) => void) => {
  return async () => {
    console.log(`Select "${song.name}"`);

    onSongSelected(song);
  };
};
