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
    return handle;
  };

  return {
    isShowDirectoryPickerSupported,
    browseDirectory,
  };
};
