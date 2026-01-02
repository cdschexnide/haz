import React, { useRef, useEffect } from "react";
import { PanResponder, View } from "react-native";
import Svg, { Rect, Circle } from "react-native-svg";
import { Region } from "@/types/sddg-template";
import {
  updateRegionByCorner,
  updateRegionByEdge,
  moveRegion,
  constrainRegion,
} from "@/utils/sddg/coordinateConverter";

export interface DraggableRegionProps {
  region: Region;
  isSelected: boolean;
  color: string;
  onRegionChange: (region: Region) => void;
  onSelect: () => void;
  imageWidth: number;
  imageHeight: number;
  label?: string;
}

const HANDLE_SIZE = 20; // Size of corner/edge handles
const HANDLE_COLOR = "#00FF00"; // Green handles
const SELECTED_STROKE = "#00FF00";
const UNSELECTED_STROKE = "#FF0000";
const STROKE_WIDTH = 2;
// Minimum region size in DISPLAY coordinates
// Reduced from 32 to 12 to allow smaller regions on screen
// (Will still enforce 32px minimum in template coordinates during save)
const MIN_REGION_SIZE = 12;

export default function DraggableRegion({
  region,
  isSelected,
  color,
  onRegionChange,
  onSelect,
  imageWidth,
  imageHeight,
  label,
}: DraggableRegionProps) {
  // Keep track of the current region prop value
  const currentRegionRef = useRef<Region>(region);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialRegionRef = useRef<Region>(region);
  const dragTypeRef = useRef<
    | "move"
    | "corner-tl"
    | "corner-tr"
    | "corner-bl"
    | "corner-br"
    | "edge-top"
    | "edge-right"
    | "edge-bottom"
    | "edge-left"
    | null
  >(null);

  // Update ref whenever region prop changes
  useEffect(() => {
    currentRegionRef.current = region;
  }, [region]);

  // Create pan responder for the region box (move)
  const boxPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isSelected,
      onMoveShouldSetPanResponder: () => isSelected,
      onPanResponderGrant: (evt, gestureState) => {
        dragStartRef.current = { x: gestureState.x0, y: gestureState.y0 };
        initialRegionRef.current = { ...currentRegionRef.current };
        dragTypeRef.current = "move";
        onSelect(); // Ensure selected
      },
      onPanResponderMove: (evt, gestureState) => {
        if (dragTypeRef.current === "move") {
          const deltaX = gestureState.dx;
          const deltaY = gestureState.dy;

          const updatedRegion = moveRegion(
            initialRegionRef.current,
            deltaX,
            deltaY
          );
          const constrainedRegion = constrainRegion(
            updatedRegion,
            imageWidth,
            imageHeight,
            MIN_REGION_SIZE
          );

          onRegionChange(constrainedRegion);
        }
      },
      onPanResponderRelease: () => {
        dragTypeRef.current = null;
      },
    })
  ).current;

  // Create pan responder factory for handles
  const createHandlePanResponder = (
    handleType:
      | "corner-tl"
      | "corner-tr"
      | "corner-bl"
      | "corner-br"
      | "edge-top"
      | "edge-right"
      | "edge-bottom"
      | "edge-left"
  ) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        dragStartRef.current = { x: gestureState.x0, y: gestureState.y0 };
        initialRegionRef.current = { ...currentRegionRef.current };
        dragTypeRef.current = handleType;
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaX = gestureState.dx;
        const deltaY = gestureState.dy;

        let updatedRegion: Region;

        if (handleType.startsWith("corner-")) {
          const corner = handleType.replace("corner-", "") as
            | "tl"
            | "tr"
            | "bl"
            | "br";
          updatedRegion = updateRegionByCorner(
            initialRegionRef.current,
            corner,
            deltaX,
            deltaY
          );
        } else {
          const edge = handleType.replace("edge-", "") as
            | "top"
            | "right"
            | "bottom"
            | "left";
          updatedRegion = updateRegionByEdge(
            initialRegionRef.current,
            edge,
            deltaX,
            deltaY
          );
        }

        const constrainedRegion = constrainRegion(
          updatedRegion,
          imageWidth,
          imageHeight,
          MIN_REGION_SIZE
        );

        onRegionChange(constrainedRegion);
      },
      onPanResponderRelease: () => {
        dragTypeRef.current = null;
      },
    });
  };

  // Pan responders for each handle
  const tlPanResponder = useRef(createHandlePanResponder("corner-tl")).current;
  const trPanResponder = useRef(createHandlePanResponder("corner-tr")).current;
  const blPanResponder = useRef(createHandlePanResponder("corner-bl")).current;
  const brPanResponder = useRef(createHandlePanResponder("corner-br")).current;
  const topPanResponder = useRef(createHandlePanResponder("edge-top")).current;
  const rightPanResponder = useRef(
    createHandlePanResponder("edge-right")
  ).current;
  const bottomPanResponder = useRef(
    createHandlePanResponder("edge-bottom")
  ).current;
  const leftPanResponder = useRef(
    createHandlePanResponder("edge-left")
  ).current;

  const strokeColor = isSelected ? SELECTED_STROKE : UNSELECTED_STROKE;
  const fillOpacity = isSelected ? 0.3 : 0.15;
  const strokeWidth = isSelected ? 3 : 2;

  return (
    <>
      {/* Region box - tap to select, drag to move if selected */}
      <View
        {...(isSelected ? boxPanResponder.panHandlers : {})}
        onTouchStart={() => {
          if (!isSelected) {
            console.log(
              `Selecting region at (${region.x}, ${region.y}) size ${region.w}x${region.h}`
            );
            onSelect();
          }
        }}
        style={{
          position: "absolute",
          left: region.x,
          top: region.y,
          width: region.w,
          height: region.h,
        }}
      >
        <Svg width={region.w} height={region.h}>
          <Rect
            x={0}
            y={0}
            width={region.w}
            height={region.h}
            fill={color}
            fillOpacity={fillOpacity}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </Svg>
      </View>

      {/* Render handles only when selected */}
      {isSelected && (
        <>
          {/* Corner handles */}
          {/* Top-left */}
          <View
            {...tlPanResponder.panHandlers}
            style={{
              position: "absolute",
              left: region.x - HANDLE_SIZE / 2,
              top: region.y - HANDLE_SIZE / 2,
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
            }}
          >
            <Svg width={HANDLE_SIZE} height={HANDLE_SIZE}>
              <Circle
                cx={HANDLE_SIZE / 2}
                cy={HANDLE_SIZE / 2}
                r={HANDLE_SIZE / 2}
                fill={HANDLE_COLOR}
                stroke="#000"
                strokeWidth={1}
              />
            </Svg>
          </View>

          {/* Top-right */}
          <View
            {...trPanResponder.panHandlers}
            style={{
              position: "absolute",
              left: region.x + region.w - HANDLE_SIZE / 2,
              top: region.y - HANDLE_SIZE / 2,
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
            }}
          >
            <Svg width={HANDLE_SIZE} height={HANDLE_SIZE}>
              <Circle
                cx={HANDLE_SIZE / 2}
                cy={HANDLE_SIZE / 2}
                r={HANDLE_SIZE / 2}
                fill={HANDLE_COLOR}
                stroke="#000"
                strokeWidth={1}
              />
            </Svg>
          </View>

          {/* Bottom-left */}
          <View
            {...blPanResponder.panHandlers}
            style={{
              position: "absolute",
              left: region.x - HANDLE_SIZE / 2,
              top: region.y + region.h - HANDLE_SIZE / 2,
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
            }}
          >
            <Svg width={HANDLE_SIZE} height={HANDLE_SIZE}>
              <Circle
                cx={HANDLE_SIZE / 2}
                cy={HANDLE_SIZE / 2}
                r={HANDLE_SIZE / 2}
                fill={HANDLE_COLOR}
                stroke="#000"
                strokeWidth={1}
              />
            </Svg>
          </View>

          {/* Bottom-right */}
          <View
            {...brPanResponder.panHandlers}
            style={{
              position: "absolute",
              left: region.x + region.w - HANDLE_SIZE / 2,
              top: region.y + region.h - HANDLE_SIZE / 2,
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
            }}
          >
            <Svg width={HANDLE_SIZE} height={HANDLE_SIZE}>
              <Circle
                cx={HANDLE_SIZE / 2}
                cy={HANDLE_SIZE / 2}
                r={HANDLE_SIZE / 2}
                fill={HANDLE_COLOR}
                stroke="#000"
                strokeWidth={1}
              />
            </Svg>
          </View>

          {/* Edge handles (smaller) */}
          {/* Top edge */}
          <View
            {...topPanResponder.panHandlers}
            style={{
              position: "absolute",
              left: region.x + region.w / 2 - HANDLE_SIZE / 3,
              top: region.y - HANDLE_SIZE / 3,
              width: (HANDLE_SIZE * 2) / 3,
              height: (HANDLE_SIZE * 2) / 3,
            }}
          >
            <Svg width={(HANDLE_SIZE * 2) / 3} height={(HANDLE_SIZE * 2) / 3}>
              <Circle
                cx={(HANDLE_SIZE * 2) / 6}
                cy={(HANDLE_SIZE * 2) / 6}
                r={(HANDLE_SIZE * 2) / 6}
                fill={HANDLE_COLOR}
                stroke="#000"
                strokeWidth={1}
                fillOpacity={0.7}
              />
            </Svg>
          </View>

          {/* Right edge */}
          <View
            {...rightPanResponder.panHandlers}
            style={{
              position: "absolute",
              left: region.x + region.w - HANDLE_SIZE / 3,
              top: region.y + region.h / 2 - HANDLE_SIZE / 3,
              width: (HANDLE_SIZE * 2) / 3,
              height: (HANDLE_SIZE * 2) / 3,
            }}
          >
            <Svg width={(HANDLE_SIZE * 2) / 3} height={(HANDLE_SIZE * 2) / 3}>
              <Circle
                cx={(HANDLE_SIZE * 2) / 6}
                cy={(HANDLE_SIZE * 2) / 6}
                r={(HANDLE_SIZE * 2) / 6}
                fill={HANDLE_COLOR}
                stroke="#000"
                strokeWidth={1}
                fillOpacity={0.7}
              />
            </Svg>
          </View>

          {/* Bottom edge */}
          <View
            {...bottomPanResponder.panHandlers}
            style={{
              position: "absolute",
              left: region.x + region.w / 2 - HANDLE_SIZE / 3,
              top: region.y + region.h - HANDLE_SIZE / 3,
              width: (HANDLE_SIZE * 2) / 3,
              height: (HANDLE_SIZE * 2) / 3,
            }}
          >
            <Svg width={(HANDLE_SIZE * 2) / 3} height={(HANDLE_SIZE * 2) / 3}>
              <Circle
                cx={(HANDLE_SIZE * 2) / 6}
                cy={(HANDLE_SIZE * 2) / 6}
                r={(HANDLE_SIZE * 2) / 6}
                fill={HANDLE_COLOR}
                stroke="#000"
                strokeWidth={1}
                fillOpacity={0.7}
              />
            </Svg>
          </View>

          {/* Left edge */}
          <View
            {...leftPanResponder.panHandlers}
            style={{
              position: "absolute",
              left: region.x - HANDLE_SIZE / 3,
              top: region.y + region.h / 2 - HANDLE_SIZE / 3,
              width: (HANDLE_SIZE * 2) / 3,
              height: (HANDLE_SIZE * 2) / 3,
            }}
          >
            <Svg width={(HANDLE_SIZE * 2) / 3} height={(HANDLE_SIZE * 2) / 3}>
              <Circle
                cx={(HANDLE_SIZE * 2) / 6}
                cy={(HANDLE_SIZE * 2) / 6}
                r={(HANDLE_SIZE * 2) / 6}
                fill={HANDLE_COLOR}
                stroke="#000"
                strokeWidth={1}
                fillOpacity={0.7}
              />
            </Svg>
          </View>
        </>
      )}
    </>
  );
}
