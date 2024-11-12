import { parseBlob, type IAudioMetadata } from "music-metadata";

import { type ArtistNode } from "../model";

export const createMusicLibrary = async (rootDirectoryHandle: FileSystemDirectoryHandle) => {
  const lib: ArtistNode[] = [];

  await findMusicFiles(rootDirectoryHandle, async handle => {
    const file = await handle.getFile();
    const metadata = await parseBlob(file);
    await addSong(lib, metadata);
  });
  return lib;
};

const findMusicFiles = async (
  directoryHandle: FileSystemDirectoryHandle,
  onFound: (handle: FileSystemFileHandle) => Promise<void>,
) => {
  const extensions = ["mp3", "m4a", "flac", "wav", "ogg", "aiff"];

  const entries = directoryHandle.entries();
  if (entries) {
    for await (const [name, handle] of entries) {
      if (handle instanceof FileSystemFileHandle) {
        const ext = name.split(".").pop();
        if (ext && extensions.includes(ext)) {
          await onFound(handle);
        }
      } else if (handle instanceof FileSystemDirectoryHandle) {
        await findMusicFiles(handle, onFound);
      }
    }
  }
};

const addSong = async (lib: ArtistNode[], metadata: IAudioMetadata) => {
  const albumArtistStr = metadata.common.albumartist || "(unknown)";
  const albumTitleStr = metadata.common.album || "(unknown)";
  const songTitleStr = metadata.common.title || "(unknown)";

  let artist = lib.find(artist => artist.name === albumArtistStr);
  if (!artist) {
    artist = {
      name: albumArtistStr,
    };
    lib.push(artist);
  }
  if (!artist.children) {
    artist.children = [];
  }

  let album = artist.children.find(album => album.name === albumTitleStr);
  if (!album) {
    album = {
      name: albumTitleStr,
    };
    artist.children.push(album);
  }
  if (!album.children) {
    album.children = [];
  }

  album.children.push({
    name: songTitleStr,
    duration: metadata.format.duration || 0,
    imageUri: "",
  });
};
