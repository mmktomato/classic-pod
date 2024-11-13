import { useCallback, useEffect, useState } from "react";

import { type NavigationNode, type Artist, type Album, type Song } from "./model";
import { createMusicLibrary } from "./Modules/library";

// TODO: Remove this when `showDirectoryPicker` is available in TypeScript.
declare global {
  interface Window {
    // https://wicg.github.io/file-system-access/#api-showdirectorypicker
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
}

const isShowDirectoryPickerSupported = () => "showDirectoryPicker" in window;

const useRootDirectory = () => {
  const [rootDirectory, setRootDirectory] = useState<FileSystemDirectoryHandle | undefined>(
    undefined,
  );

  const browseDirectory = useCallback(async () => {
    if (!isShowDirectoryPickerSupported()) {
      return;
    }
    const handle = await window.showDirectoryPicker();

    // TODO: Save the path to localStorage.
    setRootDirectory(handle);
  }, []);

  return { rootDirectory, browseDirectory };
};

export const useNavigation = () => {
  const { rootDirectory, browseDirectory } = useRootDirectory();
  const [navigation, setNavigation] = useState<NavigationNode[]>([]);

  useEffect(() => {
    const browseNavigation: NavigationNode = {
      name: "Browse",
      command: async () => {
        if (!isShowDirectoryPickerSupported()) {
          alert("Directory picker is not supported.");
          return;
        }
        await browseDirectory();
      },
    };

    const topNavigation: NavigationNode[] = rootDirectory
      ? [
          {
            name: "Artists",
            command: async () => {
              // TODO: Show a loading spinner.
              const lib = await createMusicLibrary(rootDirectory);
              const artistNavigation = lib.map<NavigationNode>(artist =>
                library2NavigationNode(artist, next => setNavigation(next)),
              );
              setNavigation(artistNavigation);
            },
          },
          browseNavigation,
        ]
      : [browseNavigation];
    setNavigation(topNavigation);
  }, [rootDirectory, browseDirectory]);

  return { navigation };
};

const library2NavigationNode = (
  item: Artist | Album | Song,
  onNext: (navigation: NavigationNode[]) => void,
): NavigationNode => {
  return {
    name: item.name,
    imageUri: "imageUri" in item ? item.imageUri : undefined,
    command: async () => {
      if ("children" in item) {
        const nextNavigation = item.children.map<NavigationNode>(child => {
          return library2NavigationNode(child, onNext);
        });
        onNext(nextNavigation);
      } else {
        alert(item.name);
      }
    },
  };
};
