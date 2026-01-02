import { attachment6DocumentNodesList } from "../../server/attachment6/documentNodes/A6";
import { DocumentNode } from "../../types";
import { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function renderDocumentNodesJSXTree(
  rootId: string,
  nodes: DocumentNode[]
): JSX.Element | null {
  const visited = new Set<string>();

  function renderNode(nodeId: string, depth: number): JSX.Element | null {
    if (visited.has(nodeId)) return null;
    visited.add(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      console.warn(`Node with id ${nodeId} not found.`);
      return null;
    }

    const children = (node.childNodeIds || []).map(childId =>
      renderNode(childId, depth + 1)
    );

    return (
      <View
        key={node.id}
        style={[
          styles.nodeContainer,
          { marginLeft: depth * 16, paddingLeft: depth === 0 ? 0 : 12 },
        ]}
      >
        <View style={styles.nodeHeaderContainer}>
          <Text style={styles.inlineText}>
            <Text style={styles.nodeId}>{node.id} </Text>
            {node.title ? (
              <>
                <Text style={styles.nodeTitle}>{node.title} </Text>
                <Text style={styles.nodeBody}>{node.bodyText?.trim()}</Text>
              </>
            ) : (
              <Text style={styles.nodeBody}>{node.bodyText?.trim()}</Text>
            )}
          </Text>
        </View>
        {children}
      </View>
    );
  }

  return renderNode(rootId, 0);
}

const styles = StyleSheet.create({
  nodeContainer: {
    backgroundColor: "#fff",
    padding: 5,
    paddingLeft: 15,
    marginLeft: 5,
  },
  nodeHeaderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    marginBottom: 6,
  },
  nodeId: {
    fontSize: 17,
    fontWeight: "600",
    color: "#007bff",
    marginRight: 4,
  },
  nodeTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#222",
    flexShrink: 1,
  },
  nodeBody: {
    fontSize: 17,
    color: "#444",
    lineHeight: 20,
  },
  inlineText: {
    flexShrink: 1,
    flexWrap: "wrap",
    fontSize: 17,
    color: "#333",
  },
});

interface AerosolsSpecialProvisionsAcknowledgements {
  informativeStatementsDocumentNodes: JSX.Element[];
  workflowModifiersDocumentNodes: JSX.Element[];
}

// export const A6_2_1NonToxicAerosolsWorkflowModifiers: AerosolsSpecialProvisionsAcknowledgements =
// {
//   informativeStatementsDocumentNodes: [A6_2],
//   workflowModifiersDocumentNodes: [
//     A6_2_1,
//     A6_2_1_1,
//     A6_2_1_2,
//     A6_2_1_3,
//     A6_2_1_4,
//     A6_2_1_5,
//     A6_2_1_6,
//   ],
// };

// export const A6_2_2WorkflowModifiers: AerosolsSpecialProvisionsAcknowledgements =
// {
//   informativeStatementsDocumentNodes: [A6_2],
//   workflowModifiersDocumentNodes: [
//     A6_2_2,
//     A6_2_2_1,
//     A6_2_2_2,
//     A6_2_2_3,
//     A6_2_2_4,
//     A6_2_2_5,
//     A6_2_2_6,
//   ],
// };

// export const A6_2_3WorkflowModifiers: AerosolsSpecialProvisionsAcknowledgements =
// {
//   informativeStatementsDocumentNodes: [A6_2],
//   workflowModifiersDocumentNodes: [
//     A6_2_3,
//     A6_2_3_1,
//     A6_2_3_2,
//     A6_2_3_3,
//     A6_2_3_4,
//     A6_2_3_5,
//     A6_2_3_6,
//     A6_2_3_7,
//   ],
// };

// export const A6_2_4WorkflowModifiers: AerosolsSpecialProvisionsAcknowledgements =
// {
//   informativeStatementsDocumentNodes: [A6_2],
//   workflowModifiersDocumentNodes: [A6_2_4, A6_2_4_1, A6_2_4_2],
// };

/* 
  Combination or Composite Packaging?
  - various gross mass and volume constrictions
*/
export const A6_3WorkflowModifiers = {
  informativeStatementsDocumentNodes: [
    renderDocumentNodesJSXTree(
      "A6.3.",
      attachment6DocumentNodesList
    ) as JSX.Element,
  ],
  workflowModifiersDocumentNodes: [],
};

export const A6_4WorkflowModifiers = {
  informativeStatementsDocumentNodes: [],
  workflowModifiersDocumentNodes: [
    renderDocumentNodesJSXTree(
      "A6.4.1.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.4.2.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.4.3.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.4.4.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.4.5.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.4.6.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.4.7.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.4.8.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.4.9.",
      attachment6DocumentNodesList
    ) as JSX.Element,
  ],
};

export const A6_5WorkflowModifiers = {
  informativeStatementsDocumentNodes: [],
  workflowModifiersDocumentNodes: [
    renderDocumentNodesJSXTree(
      "A6.5.1.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.2.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.3.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.4.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.5.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.6.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.7.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.8.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.9.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.10.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.11.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.12.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.13.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.5.14.",
      attachment6DocumentNodesList
    ) as JSX.Element,
  ],
};

export const A6_6WorkflowModifiers = {
  informativeStatementsDocumentNodes: [],
  workflowModifiersDocumentNodes: [
    renderDocumentNodesJSXTree(
      "A6.6.1.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.6.2.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.6.3.",
      attachment6DocumentNodesList
    ) as JSX.Element,
    renderDocumentNodesJSXTree(
      "A6.6.4.",
      attachment6DocumentNodesList
    ) as JSX.Element,
  ],
};

/* 
  - ship only in DOT 8 or DOT 8AL cylinders
*/
export const A6_9WorkflowModifiers: AerosolsSpecialProvisionsAcknowledgements =
  {
    informativeStatementsDocumentNodes: [],
    workflowModifiersDocumentNodes: [
      renderDocumentNodesJSXTree(
        "A6.9.",
        attachment6DocumentNodesList
      ) as JSX.Element,
    ],
  };

export const A6_15WorkflowModifiers: AerosolsSpecialProvisionsAcknowledgements =
  {
    informativeStatementsDocumentNodes: [
      renderDocumentNodesJSXTree(
        "A6.15.1.",
        attachment6DocumentNodesList
      ) as JSX.Element,
    ],
    workflowModifiersDocumentNodes: [
      renderDocumentNodesJSXTree(
        "A6.15.2.",
        attachment6DocumentNodesList
      ) as JSX.Element,
    ],
  };
