import { AlbumEntity, ArtistEntity, SongEntity } from "../model";

const version = 1;
let db: IDBDatabase | null = null;

const rejectIfDbIsNotOpened = (
  _db: IDBDatabase | null,
  reject: (reason?: unknown) => void,
): _db is IDBDatabase => {
  if (!_db) {
    reject(new Error("db is not opened."));
    return false;
  }
  return true;
};

export const openDb = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const openReq = window.indexedDB.open("classic-pod", version);

    openReq.addEventListener("error", e => {
      console.error("IndexDB open error:", e);
      reject(new Error("IndexDB open error."));
    });

    openReq.addEventListener("success", e => {
      const _openReq = e.target as IDBRequest<IDBDatabase>;
      db = _openReq.result;
      resolve();
    });

    openReq.addEventListener("upgradeneeded", e => {
      console.log(`Upgrading... old: ${e.oldVersion}, new: ${e.newVersion}`);

      const _openReq = e.target as IDBRequest<IDBDatabase>;
      db = _openReq.result;

      db.createObjectStore("artists", { keyPath: "name" });

      const albumStore = db.createObjectStore("albums", { keyPath: ["name", "artist"] });
      albumStore.createIndex("artist", "artist", { unique: false });

      const songStore = db.createObjectStore("songs", { keyPath: ["name", "artist", "album"] });
      songStore.createIndex("artist-album", ["artist", "album"], { unique: false });
    });
  });
};

export const deleteAllData = (): Promise<void[]> => {
  const stores = ["artists", "albums", "songs"];
  const promises = stores.map<Promise<void>>(store => {
    return new Promise<void>((resolve, reject) => {
      if (!rejectIfDbIsNotOpened(db, reject)) {
        return;
      }

      const req = db.transaction(store, "readwrite").objectStore(store).clear();

      req.addEventListener("error", e => {
        console.error(`Delete ${store} error:`, e);
        reject(new Error(`Delete ${store} error.`));
      });

      req.addEventListener("success", () => {
        resolve();
      });
    });
  });
  return Promise.all(promises);
};

export const upsertArtist = (artist: ArtistEntity) => {
  return new Promise<void>((resolve, reject) => {
    if (!rejectIfDbIsNotOpened(db, reject)) {
      return;
    }

    const txn = db.transaction("artists", "readwrite");
    txn.addEventListener("complete", () => {
      resolve();
    });
    txn.objectStore("artists").put(artist);
  });
};

export const upsertAlbum = (album: AlbumEntity) => {
  return new Promise<void>((resolve, reject) => {
    if (!rejectIfDbIsNotOpened(db, reject)) {
      return;
    }

    const txn = db.transaction("albums", "readwrite");
    txn.addEventListener("complete", () => {
      resolve();
    });
    txn.objectStore("albums").put(album);
  });
};

export const upsertSong = (song: SongEntity) => {
  return new Promise<void>((resolve, reject) => {
    if (!rejectIfDbIsNotOpened(db, reject)) {
      return;
    }

    const txn = db.transaction("songs", "readwrite");
    txn.addEventListener("complete", () => {
      resolve();
    });
    txn.objectStore("songs").put(song);
  });
};

export const getAllArtists = (): Promise<ArtistEntity[]> => {
  return new Promise<ArtistEntity[]>((resolve, reject) => {
    if (!rejectIfDbIsNotOpened(db, reject)) {
      return;
    }

    const req = db.transaction("artists").objectStore("artists").getAll();

    req.addEventListener("error", e => {
      console.error("getAllArtists error:", e);
      reject(new Error("getAllArtists error."));
    });

    req.addEventListener("success", e => {
      const _req = e.target as IDBRequest<ArtistEntity[]>;
      resolve(_req.result);
    });
  });
};

export const getArtist = (artistName: string): Promise<ArtistEntity | null> => {
  return new Promise<ArtistEntity | null>((resolve, reject) => {
    if (!rejectIfDbIsNotOpened(db, reject)) {
      return;
    }

    const range = IDBKeyRange.only(artistName);
    const req = db.transaction("artists").objectStore("artists").get(range);

    req.addEventListener("error", e => {
      console.error("getArtist error:", e);
      reject(new Error("getArtist error."));
    });

    req.addEventListener("success", e => {
      const _req = e.target as IDBRequest<ArtistEntity | null>;
      resolve(_req.result);
    });
  });
};

export const getArtistAlbums = (artistName: string): Promise<AlbumEntity[]> => {
  return new Promise<AlbumEntity[]>((resolve, reject) => {
    if (!rejectIfDbIsNotOpened(db, reject)) {
      return;
    }

    const range = IDBKeyRange.only(artistName);
    const req = db.transaction("albums").objectStore("albums").index("artist").getAll(range);

    req.addEventListener("error", e => {
      console.error("getArtistAlbums error:", e);
      reject(new Error("getArtistAlbums error."));
    });

    req.addEventListener("success", e => {
      const _req = e.target as IDBRequest<AlbumEntity[]>;
      resolve(_req.result);
    });
  });
};

export const getArtistAlbum = (
  artistName: string,
  albumName: string,
): Promise<AlbumEntity | null> => {
  return new Promise<AlbumEntity | null>((resolve, reject) => {
    if (!rejectIfDbIsNotOpened(db, reject)) {
      return;
    }

    const range = IDBKeyRange.only([albumName, artistName]);
    const req = db.transaction("albums").objectStore("albums").get(range);

    req.addEventListener("error", e => {
      console.error("getArtistAlbum error:", e);
      reject(new Error("getArtistAlbum error."));
    });

    req.addEventListener("success", e => {
      const _req = e.target as IDBRequest<AlbumEntity | null>;
      resolve(_req.result);
    });
  });
};

export const getAlbumSongs = (album: AlbumEntity): Promise<SongEntity[]> => {
  return new Promise<SongEntity[]>((resolve, reject) => {
    if (!rejectIfDbIsNotOpened(db, reject)) {
      return;
    }

    const range = IDBKeyRange.only([album.artist, album.name]);
    const req = db.transaction("songs").objectStore("songs").index("artist-album").getAll(range);

    req.addEventListener("error", e => {
      console.error("getAlbumSongs error:", e);
      reject(new Error("getAlbumSongs error."));
    });

    req.addEventListener("success", e => {
      const _req = e.target as IDBRequest<SongEntity[]>;
      resolve(_req.result);
    });
  });
};
