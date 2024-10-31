import { clsx } from "clsx";

import { ListBox } from "./ListBox";
import { type DisplayContents } from "../model";

interface PanelProps {
  className?: string;
  contents: DisplayContents;
  selectedIndex: number;
}

export const Panel: React.FC<PanelProps> = ({ className, contents, selectedIndex }) => {
  return (
    <div className={clsx(className, "bg-white", "border-2", "rounded-md", "border-gray-600")}>
      <div className={clsx("flex", "justify-between", "h-full", "rounded-sm")}>
        <div className={clsx("w-1/2")}>
          <ListBox
            treeNode={contents.treeNode}
            selectedIndex={selectedIndex}
          />
        </div>
        <div className={clsx("w-1/2", "flex", "items-center")}>
          {contents.coverUri && <img src={contents.coverUri} />}
        </div>
      </div>
    </div>
  );
};
