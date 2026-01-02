import React from "react";
import { View, StyleSheet } from "react-native";
import { WorkflowChevron, WorkflowChevronIcon } from "./WorkflowChevron";

console.warn = () => { };

export interface WorkflowRowMember {
  key: string;
  icon?: WorkflowChevronIcon;
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

export interface WorkflowRowProps {
  workflowRowMembers: WorkflowRowMember[]; // standard workflow
  // workflowInfoMember: WorkflowRowMember; // info & buttons
  width: number;
  height: number;
}

export function WorkflowRow({
  workflowRowMembers,
  // workflowInfoMember,
  width,
  height,
}: WorkflowRowProps): JSX.Element {
  const INFO_SIZE = 3;

  const chevrons = workflowRowMembers.map((member, index, arr) => (
    <WorkflowChevron
      key={`${member}-${index}`}
      width={Math.floor(width / (arr.length + INFO_SIZE))}
      height={height}
      title={member.title}
      subtitle={member.subtitle}
      icon={member.icon}
      chevKey={member.key}
      keySuplemental={member.key}
      onPress={workflowRowMembers[index].onPress}
      position={index === arr.length - 1 ? "last" : "middle"}
      percentComplete={member.percentComplete}
      isActive={member.isActive}
      isTouchable
      hasDiscrepancy={member.hasDiscrepancy}
      timeCompleted={member.timeCompleted}
    />
  ));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
    },
  });

  return (
    <View style={{ ...styles.container }}>
      {/* <WorkflowChevron
        chevKey={workflowInfoMember.key}
        keySuplemental={workflowInfoMember.key}
        onPress={workflowInfoMember.onPress}
        width={Math.floor(
          (width / (workflowRowMembers.length + INFO_SIZE)) * INFO_SIZE
        )}
        height={80}
        title={workflowInfoMember.title}
        position="first"
        content={workflowInfoMember.content}
        isTouchable
      /> */}
      {chevrons}
    </View>
  );
}
