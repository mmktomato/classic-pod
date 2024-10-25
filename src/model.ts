export interface TreeNode {
  name: string;
  children?: (string | TreeNode)[];
}

export interface DisplayContents {
  treeNode: TreeNode;
  coverUri?: string;
}
