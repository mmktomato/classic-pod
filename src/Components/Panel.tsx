import { clsx } from "clsx";

import { type PanelView } from "../model";

interface PanelProps {
  className?: string;
  panelView: PanelView;
}

export const Panel: React.FC<PanelProps> = ({ className, panelView }) => {
  return (
    <div className={clsx(className, "bg-white", "border-2", "rounded-md", "border-gray-600")}>
      <panelView.Component {...panelView.props} />
    </div>
  );
};
