import { clsx } from "clsx"

import { ListBox } from "./ListBox"

interface PanelProps {
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({
  className,
}) => {
  return (
    <div
      className={clsx(className,
        "bg-white",
        "border-2", "rounded-md", "border-gray-600",
      )}
    >
      <div className={clsx(
        "flex", "justify-between",
        "h-full", "rounded-sm",
      )}>
        <div className={clsx(
          "w-1/2",
        )}>
          <ListBox />
        </div>
        <div className={clsx(
          "w-1/2",
          "flex", "items-center"
        )}>
          {/*  TODO: fix this */}
          <img src="https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png" />
        </div>
      </div>
    </div>
  )
}
