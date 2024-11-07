import { type Song } from "./model";

// TODO: Remove this when `showDirectoryPicker` is available in TypeScript.
declare global {
  interface Window {
    // https://wicg.github.io/file-system-access/#api-showdirectorypicker
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
}

export const useDirectoryBrowse = () => {
  const isShowDirectoryPickerSupported = "showDirectoryPicker" in window;

  const browseDirectory = async () => {
    if (!isShowDirectoryPickerSupported) {
      return;
    }
    const handle = await window.showDirectoryPicker();

    // TODO: Save the path to localStorage.
    return handle;
  };

  // TODO: Create methods to show and change the root directory.

  return {
    isShowDirectoryPickerSupported,
    browseDirectory,
  };
};

// TODO: Move this to somewhere as this isn't a part of hook.'
export const createMusicLibrary = async (rootDirectoryHandle: FileSystemDirectoryHandle) => {
  // TODO: fix this
  const lib: Song[] = [];
  await findMusicFiles(rootDirectoryHandle, async handle => {
    const file = await handle.getFile();
    // TODO: Parse file and construct the library.
    lib.push({
      name: file.name,
      duration: 0,
      imageUri: "",
    });
  });
  return lib;
};

const findMusicFiles = async (
  directoryHandle: FileSystemDirectoryHandle,
  onFound: (handle: FileSystemFileHandle) => void,
) => {
  const extensions = ["mp3", "m4a", "flac", "wav", "ogg", "aiff"];

  const entries = directoryHandle.entries();
  if (entries) {
    for await (const [name, handle] of entries) {
      if (handle instanceof FileSystemFileHandle) {
        const ext = name.split(".").pop();
        if (ext && extensions.includes(ext)) {
          onFound(handle);
        }
      } else if (handle instanceof FileSystemDirectoryHandle) {
        await findMusicFiles(handle, onFound);
      }
    }
  }
};
