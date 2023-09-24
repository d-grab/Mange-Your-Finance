import React, { FC } from "react";

import {
  Canvas,
  Path,
  SkFont,
  Skia,
  SkiaMutableValue,
  Text,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import { useColorScheme } from "react-native";

interface CircularProgressProps {
  strokeWidth: number;
  radius: number;
  backgroundColor: string;
  percentageComplete: SkiaMutableValue<number>;
  font: SkFont;
  smallerFont: SkFont;
  targetPercentage: number;
  is100Mode?: boolean;
  smallerText?: string;
  smallerTextX?: number
}

export const DonutChart: FC<CircularProgressProps> = ({
  strokeWidth,
  radius,
  percentageComplete,
  font,
  targetPercentage,
  smallerFont,
  is100Mode = false,
  backgroundColor,
  smallerText = "Saved",
  smallerTextX = 2
}) => {
  const colorScheme = useColorScheme();
  const innerRadius = radius - strokeWidth / 2;
  const targetText = is100Mode === true ? `${targetPercentage.toFixed(2)}` : `${(targetPercentage * 100).toFixed(2)}`;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const width = font.getTextWidth(targetText);
  const titleWidth = smallerFont.getTextWidth("Power");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <Canvas
        style={{
          flex: 1,
          backgroundColor,
        }}
      >
        <Path
          path={path}
          color="#3b7250"
          style="stroke"
          strokeJoin="round"
          strokeWidth={strokeWidth}
          strokeCap="round"
          start={0}
          end={percentageComplete}
        />
        <Path
          path={path}
          color="rgba(59, 114, 80, 0.2)"
          style="stroke"
          strokeJoin="round"
          strokeWidth={strokeWidth}
          strokeCap="round"
          start={0}
          end={100}
        />
        <Text
          x={innerRadius - width / 2}
          y={radius + strokeWidth}
          text={`${targetText}%`}
          font={font}
          opacity={1}
          color="black"
        />
        <Text
          x={innerRadius - titleWidth / smallerTextX}
          y={radius + 45}
          text={smallerText}
          font={smallerFont}
          opacity={1}
          color="black"
        />
      </Canvas>
    </View>
  );
};
