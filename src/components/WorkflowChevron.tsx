import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Svg, Polygon, Rect, Text } from "react-native-svg";
import {
  MaterialIcons,
  SimpleLineIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import colors from "../theming/colors";
import { SelectedTabIndexContext } from "../contexts/TabContext";

console.warn = () => {};

export interface WorkflowChevronIcon {
  type:
    | "MaterialIcons"
    | "FontAwesome5"
    | "SimpleLineIcons"
    | "MaterialCommunityIcons"
    | "Ionicons";
  name: string;
}

export interface WorkflowChevronProps {
  keySuplemental: string;
  chevKey: string;
  icon?: WorkflowChevronIcon;
  title?: string;
  subtitle?: string;
  width: number;
  height: number;
  position: "first" | "middle" | "last";
  content?: React.ReactNode;
  onPress?: (key: string) => void;
  percentComplete?: number;
  backgroundColor?: string;
  strokeColor?: string;
  spacerColor?: string;
  isActive?: boolean;
  isTouchable?: boolean;
  hasDiscrepancy?: boolean;
  timeCompleted?: string;
}

export function WorkflowChevron({
  icon,
  title,
  subtitle,
  width,
  height,
  position,
  content,
  keySuplemental,
  chevKey,
  onPress,
  percentComplete: percentCompleteProp = 0,
  backgroundColor,
  strokeColor = colors.mediumGrey,
  spacerColor = colors.mediumGrey,
  isActive,
  isTouchable = true,
  hasDiscrepancy,
  timeCompleted,
}: WorkflowChevronProps): JSX.Element {
  const h1 = Math.floor(height / 2);
  const x1 = 8; // Math.floor(width / 8);
  const x2 = width - x1;
  // const chevronSlope = h1 / x1;

  const percentComplete = percentCompleteProp
    ? isNaN(percentCompleteProp)
      ? 0
      : percentCompleteProp
    : 0;

  // console.log("title", title);
  // console.log("percentComplete", percentComplete);

  // Main polygon points
  const topLeft = "1,1";
  const topLeft2 = "0,0";
  // const topLeft3 = "3,0";
  const topLeftWithOutline = "3.5,3";

  const topRight = position === "last" ? `${width - 1},1` : `${x2 - 1},0`;
  const topRight2 = position === "last" ? `${width - 5},0` : `${x2 - 5},0`;
  const topRightWithOutline =
    position === "last" ? `${width - 3},2` : `${x2 - 3.5},3`;

  const rightMid = `${width - 1},${h1}`;
  const rightMid2 = `${width - 2.5},${h1}`;
  const rightMidWithOutline =
    position === "last" ? `${width - 3}, ${h1}` : `${width - 4},${h1}`;

  const bottomRightX = position === "last" ? width : x2;
  const bottomRight = `${bottomRightX - 1},${height}`;
  const bottomRight2 = `${bottomRightX - 5},${height - 5}`;
  const bottomRightWithOutline =
    position === "last"
      ? `${bottomRightX - 3}, ${height - 8}`
      : `${bottomRightX - 2.5},${height - 8}`;

  const bottomLeft = `1,${height}`;
  const bottomLeft2 = `1,${height - 5}`;
  // const bottomLeft3 = `3,${height - 5}`;
  const bottomLeftWithOutline = `4.5,${height - 8}`;

  const leftMid = position === "first" ? `0,${h1}` : `${x1},${h1}`;
  const leftMid2 = position === "first" ? `1,${h1 - 2.5}` : `${x1},${h1 - 2.5}`;
  // const leftMid3 =
  //   position === "first" ? `0,${h1 - 2.5}` : `${x1 + 3},${h1 - 2.5}`;
  const leftMidWithOutline =
    position === "first" ? `1,${h1 - 3.5}` : `${x1 + 2.5},${h1}`;

  const { setSelectedTabIndex } = useContext(SelectedTabIndexContext);

  const styles = StyleSheet.create({
    chevronStyle: {
      left: 0,
      top: 0,
    },
    icon: {
      alignSelf: "center",
      color: colors.black,
      fontSize: 34,
      top: 12,
    },
  });

  const handlePress = (): void => {
    if (onPress) {
      onPress(keySuplemental);
      setSelectedTabIndex(0);
    }
  };

  const chevronPolygon = (
    <Polygon
      points={`${topLeft} ${topRight} ${rightMid} ${bottomRight} ${bottomLeft} ${leftMid}`}
      fill={backgroundColor || colors.lightGrey}
      stroke={strokeColor || colors.mediumGrey}
      strokeWidth={5}
    />
  );

  const polygon = (
    <Polygon
      points={`${topLeft2} ${topRight2} ${rightMid2} ${bottomRight2} ${bottomLeft2} ${leftMid2}`}
      fill={backgroundColor || colors.white}
      stroke={strokeColor || colors.mediumGrey}
      strokeWidth={1}
    />
  );

  const chevronSelectedPolygon = (
    <>
      {/* <Polygon // This is the outline of the chevron
        points={`${topLeft} ${topRight} ${rightMid} ${bottomRight} ${bottomLeft} ${leftMid}`}
        stroke={colors.black}
        strokeOpacity={0.50}
        strokeWidth={2}
        
      /> */}
      <Polygon
        points={`${topLeftWithOutline} ${topRightWithOutline} ${rightMidWithOutline} ${bottomRightWithOutline} ${bottomLeftWithOutline} ${leftMidWithOutline}`}
        fill={colors.highlightBlue}
        fillOpacity={1}
        stroke={colors.highlightBlue}
        strokeWidth={1}
      />
    </>
  );

  // Status polygon points
  const spPadding = 2; // padding inside grey chevron
  const spHeight = 3;
  const spWidth =
    percentComplete === 0
      ? 0
      : Math.floor((bottomRightX - spPadding * 2 - 1.65) * percentComplete);
  const spTopLeft = `${4},${height - 1 - spPadding - spHeight}`;
  const spBottomLeft = `${3.5}, ${height - 1 - spPadding}`;
  const spBottomRight = `${spPadding + spWidth}, ${height - 1 - spPadding}`;
  const spTopRight = `${spPadding + spWidth + 0.5}, ${
    height - 1 - spPadding - spHeight
  }`;

  // console.log("percent complete", percentComplete)

  const percentCompletePolygon = (
    <Polygon
      points={`${spTopLeft} ${spTopRight} ${spBottomRight} ${spBottomLeft}`}
      fill={hasDiscrepancy ? colors.red : colors.green}
      stroke={hasDiscrepancy ? colors.red : colors.green}
      strokeWidth={1}
      strokeLinecap="round"
    />
  );

  let IconComponent = null;

  if (icon) {
    switch (icon.type) {
      case "FontAwesome5":
        IconComponent = (
          <FontAwesome5
            name={icon.name}
            size={styles.icon.fontSize}
            color={styles.icon.color}
            style={styles.icon}
            solid
          />
        );
        break;

      case "SimpleLineIcons":
        IconComponent = (
          <SimpleLineIcons
            // name={icon.name}
            name={"anchor"}
            size={24}
            color="black"
            style={styles.icon}
          />
        );
        break;

      case "MaterialIcons":
        IconComponent = (
          <MaterialIcons
            // name={icon.name}
            name={"anchor"}
            size={24}
            color="black"
            style={styles.icon}
          />
        );
        break;

      case "MaterialCommunityIcons":
        if (icon.name === "file-document-multiple-outline") {
          IconComponent = (
            <MaterialCommunityIcons
              // name={icon.name}
              name={"file-document-multiple-outline"}
              size={35}
              color="black"
              style={styles.icon}
            />
          );
        }
        // IconComponent = (
        //   <MaterialCommunityIcons
        //     // name={icon.name}
        //     name={"anchor"}
        //     size={24}
        //     color="black"
        //     style={styles.icon}
        //   />
        // );
        break;

      case "Ionicons":
        IconComponent = (
          <Ionicons
            // name={icon.name}
            name={"filter"}
            size={24}
            color="black"
            style={styles.icon}
          />
        );
        break;
      default:
        break;
    }
  }

  let shape = position === "first" ? polygon : chevronPolygon;
  if (isActive) shape = chevronSelectedPolygon;

  // console.log("shape", shape);

  if (isTouchable) {
    return (
      <TouchableOpacity key={chevKey} style={{ height }} onPress={handlePress}>
        <View>
          <Svg style={styles.chevronStyle} height={height} width={width}>
            {IconComponent}
            <Rect
              width={width}
              height={height}
              fill={spacerColor || colors.mediumGrey}
              stroke={spacerColor || colors.mediumGrey}
            />
            {shape}
            {/* Render percentCompletePolygon only if percentCompleteProp is defined */}
            {percentCompleteProp !== 0 && percentCompletePolygon}
            <Text
              x={width / 2}
              y={67}
              fontSize="12"
              textAnchor="middle"
              fontWeight="bold"
              fill="black"
            >
              {timeCompleted
                ? ((): string => {
                    const dateTime = new Date(timeCompleted);

                    // Extract month and date
                    const month = String(dateTime.getMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const date = String(dateTime.getDate()).padStart(2, "0");

                    // Extract hours and minutes
                    const hours = String(dateTime.getHours()).padStart(2, "0");
                    const minutes = String(dateTime.getMinutes()).padStart(
                      2,
                      "0"
                    );

                    return `${month}/${date} ${hours}:${minutes}`;
                  })()
                : ""}
            </Text>
            <Text
              x={width / 2}
              y={icon ? 65 : 28}
              fontSize="15"
              textAnchor="middle"
              fontWeight="bold"
              fill="black"
            >
              {title}
            </Text>
            <Text
              x={width / 2}
              y="65"
              fontSize="8"
              textAnchor="middle"
              fill="black"
              fontWeight={700}
            >
              {subtitle}
            </Text>
            {content}
          </Svg>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View key={chevKey} style={{ height }}>
      <Svg style={styles.chevronStyle} height={height} width={width}>
        {IconComponent}
        <Rect
          width={width}
          height={height}
          fill={spacerColor || colors.mediumGrey}
          stroke={spacerColor || colors.mediumGrey}
        />
        {shape}
        {/* Render percentCompletePolygon only if percentCompleteProp is defined */}
        {percentCompleteProp !== 0 && percentCompletePolygon}
        <Text
          x={width / 2}
          y={icon ? 54 : 20}
          fontSize="12"
          textAnchor="middle"
          fontWeight="bold"
          fill="black"
        >
          {title}
        </Text>
        <Text
          x={width / 2}
          y="65"
          fontSize="8"
          textAnchor="middle"
          fill="black"
          fontWeight={700}
        >
          {subtitle}
        </Text>
        {content}
      </Svg>
    </View>
  );
}
