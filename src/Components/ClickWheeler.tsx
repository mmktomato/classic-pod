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
  const requireShiftToRotate = !navigator.userAgent.toLowerCase().includes("mobile");
  console.log("requireShiftToRotate:", requireShiftToRotate);

  return (
    <div className={clsx(className, "flex", "justify-center", "items-center")}>
      <ClickWheelerComponent
        size={size}
        requireShiftToRotate={requireShiftToRotate}
        onRotate={onRotate}
        onTap={onTap}
      />
    </div>
  );
};
