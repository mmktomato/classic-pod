import { clsx } from "clsx";
import { type HTMLClickWheelerElement } from "click-wheeler";
import { ClickWheelerComponent } from "click-wheeler/react";

interface ClickWheelerProps {
  size?: number;
  className?: string;
  clickWheelerRef: React.RefObject<HTMLClickWheelerElement>;
}

export const ClickWheeler: React.FC<ClickWheelerProps> = ({
  size = 200,
  className,
  clickWheelerRef,
}) => {
  const requireShiftToRotate = !navigator.userAgent.toLowerCase().includes("mobile");
  console.log("requireShiftToRotate:", requireShiftToRotate);

  return (
    <div className={clsx(className, "flex", "justify-center", "items-center")}>
      <ClickWheelerComponent
        size={size}
        requireShiftToRotate={requireShiftToRotate}
        ref={clickWheelerRef}
      />
    </div>
  );
};
