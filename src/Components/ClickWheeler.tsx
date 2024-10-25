import { clsx } from "clsx";
import { ClickWheelerComponent } from "click-wheeler/react";

interface ClickWheelerProps {
  size?: number;
  className?: string;
}

export const ClickWheeler: React.FC<ClickWheelerProps> = ({ size = 200, className }) => {
  return (
    <div className={clsx(className, "flex", "justify-center", "items-center")}>
      <ClickWheelerComponent size={size} />
    </div>
  );
};
