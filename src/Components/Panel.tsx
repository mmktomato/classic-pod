import { clsx } from "clsx";

import { ListBox } from "./ListBox";
import { type DisplayNode, Song } from "../model";

interface PanelProps {
  className?: string;
  contents: DisplayNode[] | Song[];
  selectedIndex: number;
}

export const Panel: React.FC<PanelProps> = ({ className, contents, selectedIndex }) => {
  const selectedItem = contents.at(selectedIndex);
  return (
    <div className={clsx(className, "bg-white", "border-2", "rounded-md", "border-gray-600")}>
      <div className={clsx("flex", "justify-between", "h-full", "rounded-sm")}>
        <div className={clsx("w-1/2")}>
          <ListBox
            treeNodes={contents}
            selectedIndex={selectedIndex}
          />
        </div>
        <div className={clsx("w-1/2", "flex", "items-center")}>
          {selectedItem && "imageUri" in selectedItem && selectedItem.imageUri && (
            <img src={selectedItem.imageUri} />
          )}
        </div>
      </div>
    </div>
  );
};
