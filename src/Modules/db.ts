const version = 1;
let db: IDBDatabase | null = null;

export const openDb = () => {
  const openReq = window.indexedDB.open("classic-pod", version);

  openReq.addEventListener("error", e => {
    console.error("IndexDB open error:", e);
  });

  openReq.addEventListener("success", () => {
    db = openReq.result;
    console.log("IndexDB opened:");
  });

  openReq.addEventListener("upgradeneeded", e => {
    db = openReq.result;
    console.log(`old: ${e.oldVersion}, new: ${e.newVersion}`);

    db.createObjectStore("artists", { autoIncrement: true });

    const albumStore = db.createObjectStore("albums", { autoIncrement: true });
    albumStore.createIndex("artist", "artist", { unique: false });

    const songStore = db.createObjectStore("songs", { autoIncrement: true });
    songStore.createIndex("artist-album", ["artist", "album"], { unique: false });
  });
};

export const addArtist = (artistName: string) => {
  if (!db) {
    return;
  }

  const value = { name: artistName };
  db.transaction("artists", "readwrite").objectStore("artists").add(value);
};

export const addAlbum = (artistName: string, albumName: string) => {
  if (!db) {
    return;
  }

  const value = { artist: artistName, name: albumName };
  db.transaction("albums", "readwrite").objectStore("albums").add(value);
};

export const addSong = (artistName: string, albumName: string, songName: string) => {
  if (!db) {
    return;
  }

  const value = { artist: artistName, album: albumName, name: songName };
  db.transaction("songs", "readwrite").objectStore("songs").add(value);
};

export const getAllArtists = (): Promise<unknown> => {
  return new Promise<unknown>((resolve, reject) => {
    if (!db) {
      reject(new Error("db is not opened."));
      return;
    }

    const req = db.transaction("artists").objectStore("artists").getAll();

    req.addEventListener("error", e => {
      console.error("getAllArtists error:", e);
      reject(new Error("getAllArtists error:"));
    });

    req.addEventListener("success", e => {
      resolve(req.result);
    });
  });
};
