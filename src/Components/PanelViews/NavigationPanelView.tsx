import { useEffect, useCallback } from "react";
import { clsx } from "clsx";
import {
  type HTMLClickWheelerElement,
  type ClickWheelerRotateEvent,
  ClickWheelerTapEvent,
} from "click-wheeler";

import { useNavigation } from "../../Hooks/navigation";
import { ListBox } from "../ListBox";

interface NavigationPanelViewProps {
  clickWheelerRef: React.RefObject<HTMLClickWheelerElement>;
}

export const NavigationPanelView: React.FC<NavigationPanelViewProps> = ({ clickWheelerRef }) => {
  const { navigation, selectedIndex, setSelectedIndex } = useNavigation();

  const onRotate = useCallback(
    (e: ClickWheelerRotateEvent) => {
      if (!navigation.length) {
        return;
      }

      const lastIndex = navigation.length - 1;
      setSelectedIndex(current => {
        const newIndex = Math.min(
          lastIndex,
          Math.max(0, current + (e.detail.direction === "clockwise" ? 1 : -1)),
        );
        return newIndex;
      });
    },
    [navigation, setSelectedIndex],
  );

  const onTap = useCallback(
    (e: ClickWheelerTapEvent) => {
      const selectedNode = navigation.at(selectedIndex);
      switch (e.detail.tapArea) {
        case "center":
          selectedNode?.handleSelect();
          break;

        case "menu":
          selectedNode?.handleBack();
          break;
      }
    },
    [navigation, selectedIndex],
  );

  useEffect(() => {
    const clickWheeler = clickWheelerRef.current;
    clickWheeler?.addEventListener("rotate", onRotate);
    clickWheeler?.addEventListener("tap", onTap);

    return () => {
      clickWheeler?.removeEventListener("rotate", onRotate);
      clickWheeler?.removeEventListener("tap", onTap);
    };
  }, [clickWheelerRef, onRotate, onTap]);

  const selectedItem = navigation.at(selectedIndex);

  return (
    <div className={clsx("flex", "justify-between", "h-full", "rounded-sm")}>
      <div className={"w-1/2"}>
        <ListBox
          navigation={navigation}
          selectedIndex={selectedIndex}
        />
      </div>
      <div className={clsx("w-1/2", "flex", "items-center")}>
        {selectedItem?.imageUri && <img src={selectedItem.imageUri} />}
      </div>
    </div>
  );
};
