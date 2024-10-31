import { clsx } from "clsx";
import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";
import { ClickWheelerComponent } from "click-wheeler/react";

interface ClickWheelerProps {
  size?: number;
  className?: string;
  onRotate: (e: ClickWheelerRotateEvent) => void;
  onTap: (e: ClickWheelerTapEvent) => void;
}

export const ClickWheeler: React.FC<ClickWheelerProps> = ({
  size = 200,
  className,
  onRotate,
  onTap,
}) => {
  return (
    <div className={clsx(className, "flex", "justify-center", "items-center")}>
      <ClickWheelerComponent
        size={size}
        onRotate={onRotate}
        onTap={onTap}
      />
    </div>
  );
};
