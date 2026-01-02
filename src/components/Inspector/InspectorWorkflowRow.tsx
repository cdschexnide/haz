import React, { JSX } from "react";
import { View, StyleSheet } from "react-native";
import { InspectorWorkflowChevron, InspectorWorkflowChevronIcon } from "./InspectorWorkflowChevron";

console.warn = () => { };

export interface InspectorWorkflowRowMember {
  key: string;
  icon?: InspectorWorkflowChevronIcon;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  percentComplete?: number;
  date?: Date | string;
  onPress?: () => void;
  isActive?: boolean;
  hasDiscrepancy?: boolean;
  timeCompleted?: string;
}

export interface InspectorWorkflowRowProps {
  workflowRowMembers: InspectorWorkflowRowMember[]; // standard workflow
  // workflowInfoMember: WorkflowRowMember; // info & buttons
  width: number;
  height: number;
  disableLimitedOrExceptedChevron?: boolean;
}

export function InspectorWorkflowRow({
  workflowRowMembers,
  // workflowInfoMember,
  width,
  height,
  disableLimitedOrExceptedChevron
}: InspectorWorkflowRowProps): JSX.Element {
  // Calculate width for chevrons with proper spacing and minimum width safety
  const availableWidth = width - 30;
  const minChevronWidth = 100; // Minimum width per chevron
  const calculatedWidth = Math.floor(availableWidth / workflowRowMembers.length);
  const chevronWidth = 310;

  const chevrons = workflowRowMembers.map((member, index, arr) => (
    <InspectorWorkflowChevron
      key={`${member}-${index}`}
      width={chevronWidth}
      height={height}
      title={member.title}
      subtitle={member.subtitle}
      icon={member.icon}
      chevKey={member.key}
      keySuplemental={member.key}
      onPress={workflowRowMembers[index].onPress}
      position={index === 0 ? "first" : (index === arr.length - 1 ? "last" : "middle")}
      percentComplete={member.percentComplete}
      isActive={member.isActive}
      isTouchable
      hasDiscrepancy={member.hasDiscrepancy}
      timeCompleted={member.timeCompleted}
      disabled={disableLimitedOrExceptedChevron}
    />
  ));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center", // Center the chevrons
      // alignItems: "flex-end", // Align chevrons to bottom for better positioning
      paddingHorizontal: 5, // Minimized padding to maximize chevron space
      paddingBottom: 10, // Add bottom padding to move chevrons down slightly
    },
  });

  return (
    <View style={styles.container}>
      {chevrons}
    </View>
  );
}
