import { clsx } from "clsx";

import { type TreeNode } from "../model";

interface ListBoxProps {
  treeNode: TreeNode;
}

export const ListBox: React.FC<ListBoxProps> = ({ treeNode }) => {
  return (
    <div className={clsx("h-full", "flex", "flex-col")}>
      <div className={clsx("bg-slate-200")}>{treeNode.name}</div>
      <ul className={clsx("min-h-0", "overflow-y-scroll")}>
        {treeNode.children?.map((child, i) => (
          <li key={i}>{typeof child === "string" ? child : child.name}</li>
        ))}
      </ul>
    </div>
  );
};
