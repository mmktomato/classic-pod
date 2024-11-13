import { clsx } from "clsx";

import { ListBox } from "./ListBox";
import { type NavigationNode } from "../model";

interface PanelProps {
  className?: string;
  navigation: NavigationNode[];
  selectedIndex: number;
}

export const Panel: React.FC<PanelProps> = ({ className, navigation, selectedIndex }) => {
  const selectedItem = navigation.at(selectedIndex);
  return (
    <div className={clsx(className, "bg-white", "border-2", "rounded-md", "border-gray-600")}>
      <div className={clsx("flex", "justify-between", "h-full", "rounded-sm")}>
        <div className={clsx("w-1/2")}>
          <ListBox
            navigation={navigation}
            selectedIndex={selectedIndex}
          />
        </div>
        <div className={clsx("w-1/2", "flex", "items-center")}>
          {selectedItem?.imageUri && <img src={selectedItem.imageUri} />}
        </div>
      </div>
    </div>
  );
};
