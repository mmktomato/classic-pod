import { parseBlob, type IAudioMetadata } from "music-metadata";

import { upsertArtist, upsertAlbum, upsertSong } from "./db";

export const createMusicLibrary = async (rootDirectoryHandle: FileSystemDirectoryHandle) => {
  await findMusicFiles(rootDirectoryHandle, async handle => {
    const file = await handle.getFile();
    const metadata = await parseBlob(file);
    await addEntities(metadata);
  });
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

const addEntities = async (metadata: IAudioMetadata) => {
  const albumArtistStr = metadata.common.albumartist || "(unknown)";
  const albumTitleStr = metadata.common.album || "(unknown)";
  const songTitleStr = metadata.common.title || "(unknown)";

  upsertArtist({ name: albumArtistStr });
  upsertAlbum({ name: albumTitleStr, artist: albumArtistStr });
  upsertSong({ name: songTitleStr, album: albumTitleStr, artist: albumArtistStr });
};
