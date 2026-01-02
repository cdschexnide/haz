import { DocumentNode } from "../../types";

export default function renderDocumentNodes(
  id: string,
  nodes: DocumentNode[]
): string {
  const visited = new Set<string>();

  function dfs(nodeId: string, depth: number): string {
    if (visited.has(nodeId)) return "";
    visited.add(nodeId);

    const node = nodes.find(node => node.id === nodeId);
    if (!node) {
      console.warn(`Node with id ${nodeId} not found.`);
      return "";
    }
    const marginLeft = `${depth * 20}px`;

    let html = `<div style="margin-left: ${marginLeft};"><strong>${node.id} ${
      node.title || ""
    }</strong> ${node.bodyText || ""}</div>`;

    if (node.childNodeIds) {
      for (const childId of node.childNodeIds) {
        html += dfs(childId, depth + 1);
      }
    }

    return html;
  }

  return dfs(id, 0);
}
