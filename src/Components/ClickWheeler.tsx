import { clsx } from "clsx";
import { type ClickWheelerRotateEvent } from "click-wheeler";
import { ClickWheelerComponent } from "click-wheeler/react";

interface ClickWheelerProps {
  size?: number;
  className?: string;
  onRotate: (e: ClickWheelerRotateEvent) => void;
}

export const ClickWheeler: React.FC<ClickWheelerProps> = ({ size = 200, className, onRotate }) => {
  return (
    <div className={clsx(className, "flex", "justify-center", "items-center")}>
      <ClickWheelerComponent
        size={size}
        onRotate={onRotate}
      />
    </div>
  );
};
