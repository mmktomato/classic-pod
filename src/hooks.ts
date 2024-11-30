import { useEffect, useState } from "react";

import { type ArtistEntity, type NavigationNode } from "./model";
import { createMusicLibrary } from "./Modules/library";
import { openDb, getAllArtists, getArtistAlbums, deleteAllData } from "./Modules/db";
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

export const useNavigation = () => {
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
            command: createAllArtistsCommand(setNavigation),
          },
          scanNavigation,
        ]
      : [scanNavigation];
    setNavigation(topNavigation);
  }, [scaned]);

  return { navigation };
};

const createAllArtistsCommand = (setNavigation: (navigation: NavigationNode[]) => void) => {
  return async () => {
    console.log("All artists.");

    const artists = await getAllArtists();
    // TODO: sort
    const artistNavigation = artists.map<NavigationNode>(artist => ({
      name: artist.name,
      command: createArtistSelectCommand(artist, setNavigation),
    }));
    setNavigation(artistNavigation);
  };
};

const createArtistSelectCommand = (
  artist: ArtistEntity,
  onNext: (navigation: NavigationNode[]) => void,
) => {
  return async () => {
    console.log(artist.name);

    const albums = await getArtistAlbums(artist.name);
    // TODO: sort
    const navigation = albums.map<NavigationNode>(album => ({
      name: album.name,
      command: async () => {
        alert(album.name);
      },
    }));
    onNext(navigation);
  };
};
