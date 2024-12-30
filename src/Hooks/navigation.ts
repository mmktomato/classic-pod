import { useState, useContext, useEffect, useCallback } from "react";

import {
  type SongEntity,
  type AlbumEntity,
  type ArtistEntity,
  type NavigationNode,
  type NavigationType,
  type NavigationPanelViewType,
} from "../model";
import { createMusicLibrary } from "../Modules/library";
import {
  openDb,
  getAllArtists,
  getArtistAlbums,
  deleteAllData,
  getAlbumSongs,
} from "../Modules/db";
import * as ls from "../Modules/localStorage";
import { topContext, topDispatchContext } from "../Modules/context";
import { getArtist, getArtistAlbum } from "../Modules/db";

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
  allArtistsNavigation: NavigationNode,
) => {
  const scanNavigation: NavigationNode = {
    name: "Scan",
    handleSelect: async () => {
      try {
        const rootDirectory = await browseDirectory();

        // TODO: Show a loading spinner.
        setScaned(false);
        await scanDirectory(rootDirectory);
        setScaned(true);
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("Unknown error.");
        }
      }
    },
    handleBack: async () => {},
  };

  const topNavigation: NavigationNode[] = scaned
    ? [allArtistsNavigation, scanNavigation]
    : [scanNavigation];

  return topNavigation;
};

export const useNavigation = () => {
  const { scaned, panelViewType, song } = useContext(topContext);
  const { navigation: navigationType } = panelViewType as NavigationPanelViewType;
  const dispatch = useContext(topDispatchContext);
  const [navigation, setNavigation] = useState<NavigationNode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<ArtistEntity | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumEntity | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongEntity | null>(null);

  const setScaned = useCallback(
    (scaned: boolean) => {
      ls.setScaned(scaned);
      dispatch({ type: "scaned", value: scaned });
    },
    [dispatch],
  );

  const setNavigationType = useCallback(
    (navigationType: NavigationType) => {
      dispatch({
        type: "panelViewType",
        value: { view: "navigation", navigation: navigationType },
      });
    },
    [dispatch],
  );

  const setSelectedIndexByExistingEntity = useCallback(
    (
      entities: ArtistEntity[] | AlbumEntity[] | SongEntity[],
      selectedEntity: ArtistEntity | AlbumEntity | SongEntity | null,
    ) => {
      setSelectedIndex(() =>
        Math.max(
          0,
          selectedEntity ? entities.findIndex(entity => entity.name === selectedEntity.name) : 0,
        ),
      );
    },
    [setSelectedIndex],
  );

  const toTop = useCallback(() => {
    setSelectedIndex(0);
    setNavigation(() =>
      createTopNavigation(scaned, setScaned, {
        name: "Artists",
        handleSelect: /* top -> artists */ async () => setNavigationType("artists"),
        handleBack: async () => {},
      }),
    );
    setNavigationType("top");
  }, [scaned, setScaned, setSelectedIndex, setNavigation, setNavigationType]);

  const toArtists = useCallback(async () => {
    // TODO: sort
    const artists = await getAllArtists();

    setSelectedIndexByExistingEntity(artists, selectedArtist);
    setNavigation(() =>
      artists.map<NavigationNode>(artist => ({
        name: artist.name,
        handleSelect: /* artists -> albums */ async () => {
          setSelectedArtist(artist);
          setNavigationType("albums");
        },
        handleBack: /* artists -> top */ async () => {
          setSelectedArtist(null);
          setNavigationType("top");
        },
      })),
    );
    setNavigationType("artists");
  }, [selectedArtist, setSelectedIndexByExistingEntity, setNavigation, setNavigationType]);

  const toArtistAlbums = useCallback(
    async (artist: ArtistEntity) => {
      // TODO: sort
      const albums = await getArtistAlbums(artist.name);

      setSelectedIndexByExistingEntity(albums, selectedAlbum);
      setNavigation(() =>
        albums.map<NavigationNode>(album => ({
          name: album.name,
          handleSelect: /* albums -> songs */ async () => {
            setSelectedAlbum(album);
            setNavigationType("songs");
          },
          handleBack: /* albums -> artists */ async () => {
            setSelectedAlbum(null);
            setNavigationType("artists");
          },
        })),
      );
      setNavigationType("albums");
    },
    [selectedAlbum, setSelectedIndexByExistingEntity, setNavigation, setNavigationType],
  );

  const toAlbumSongs = useCallback(
    async (album: AlbumEntity) => {
      // TODO: sort
      const songs = await getAlbumSongs(album);

      setSelectedIndexByExistingEntity(songs, selectedSong);
      setNavigation(() =>
        songs.map<NavigationNode>(song => ({
          name: song.name,
          handleSelect: /* songs -> song */ async () => {
            setSelectedSong(song);
            dispatch({ type: "song", value: song });
            dispatch({ type: "panelViewType", value: { view: "playback" } });
          },
          handleBack: /* songs -> albums */ async () => {
            setSelectedSong(null);
            setNavigationType("albums");
          },
        })),
      );
      setNavigationType("songs");
    },
    [selectedSong, dispatch, setSelectedIndexByExistingEntity, setNavigation, setNavigationType],
  );

  useEffect(() => {
    (async () => {
      switch (navigationType) {
        case "top":
          toTop();
          break;

        case "artists":
          toArtists();
          break;

        case "albums":
          if (selectedArtist) {
            toArtistAlbums(selectedArtist);
          }
          break;

        case "songs": {
          const album =
            selectedAlbum || (song ? await getArtistAlbum(song.artist, song.album) : null);
          if (album) {
            if (!selectedArtist) {
              setSelectedArtist(await getArtist(album.artist));
            }
            if (!selectedAlbum) {
              setSelectedAlbum(album);
            }
            if (!selectedSong) {
              setSelectedSong(song || null);
            }
            toAlbumSongs(album);
          }
          break;
        }
      }
    })();
  }, [
    navigationType,
    song,
    toTop,
    toArtists,
    toArtistAlbums,
    toAlbumSongs,
    selectedArtist,
    selectedAlbum,
    selectedSong,
  ]);

  return { navigation, selectedIndex, setSelectedIndex };
};
