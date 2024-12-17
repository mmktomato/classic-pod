import { type SongEntity } from "../../model";

interface PlaybackPanelViewProps {
  song: SongEntity;
}

export const PlaybackPanelView: React.FC<PlaybackPanelViewProps> = ({ song }) => {
  return <div>{song.name}</div>;
};
