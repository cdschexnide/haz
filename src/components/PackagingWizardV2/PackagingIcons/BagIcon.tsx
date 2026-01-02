import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';

interface BagIconProps {
  size?: number;
  color?: string;
}

const BagIcon: React.FC<BagIconProps> = ({ size = 80, color = '#FFFFFF' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Simple tied bag/sack */}

      {/* Left side of bag body */}
      <Path
        d="M 28 30 Q 22 50 30 66"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      {/* Right side of bag body */}
      <Path
        d="M 52 30 Q 58 50 50 66"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      {/* Bottom of bag */}
      <Path
        d="M 30 66 Q 40 68 50 66"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      {/* Gathered top - left pleats */}
      <Line x1="28" y1="30" x2="37" y2="18" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="30" x2="38" y2="18" stroke={color} strokeWidth="1.5" />

      {/* Gathered top - right pleats */}
      <Line x1="52" y1="30" x2="43" y2="18" stroke={color} strokeWidth="2" />
      <Line x1="48" y1="30" x2="42" y2="18" stroke={color} strokeWidth="1.5" />

      {/* Tie/closure band */}
      <Path
        d="M 35 20 L 36 18 L 44 18 L 45 20"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
};

export default BagIcon;
