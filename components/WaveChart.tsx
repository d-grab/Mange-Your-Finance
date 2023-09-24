import { View } from "../components/Themed";
import { Alert, Dimensions, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import {
  Skia,
  Canvas,
  Path,
  Vertices,
  vec,
  useComputedValue,
  useClockValue,
  useValue,
  LinearGradient,
  Text,
  useFont,
} from "@shopify/react-native-skia";

import { line, curveBasis } from "d3";

const dimens = Dimensions.get("screen");
const width = 150;
const frequency = 2;
const initialAmplitude = 1;
const verticalShiftConst = 100;
const height = 600;
const horizontalShift = (dimens.width - width) / 2;

const labels = [
  0,
  undefined,
  undefined,
  undefined,
  undefined,
  5,
  undefined,
  undefined,
  undefined,
  10,
];
const indicatorArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function WaveChart({ level }: { level: number }) {
  const colorScheme = useColorScheme();
  const font = useFont(require("../assets/fonts/SpaceMono-Regular.ttf"), 20);
  const amplitude = useValue(initialAmplitude);
  const clock = useClockValue();

  //
  const verticalShift = useValue(verticalShiftConst);
  verticalShift.current = Math.min(height, convertPercentage(level));
  //

  const createWavePath = (phase = 20) => {
    let points = Array.from({ length: width + horizontalShift }, (_, index) => {
      const angle =
        ((index - horizontalShift) / width) * (Math.PI * frequency) + phase;
      return [
        index,
        amplitude.current * Math.sin(angle) + verticalShift.current,
      ];
    });

    const shiftedPoints = points.slice(horizontalShift, 300) as [
      number,
      number
    ][];
    const lineGenerator = line().curve(curveBasis);
    const waveLine = lineGenerator(shiftedPoints);
    const bottomLine = `L${
      width + horizontalShift
    },${height} L${horizontalShift},${height}`;
    const extendedWavePath = `${waveLine} ${bottomLine} Z`;
    return extendedWavePath;
  };

  const animatedPath = useComputedValue(() => {
    const current = (clock.current / 225) % 225;
    const start = Skia.Path.MakeFromSVGString(createWavePath(current))!;
    const end = Skia.Path.MakeFromSVGString(createWavePath(Math.PI * current))!;
    return start.interpolate(end, 0.5)!;
  }, [clock, verticalShift]);

  const trianglePath = useComputedValue(() => {
    return [
      vec(horizontalShift * 2.6, verticalShift.current - 20),
      vec(horizontalShift * 2.6, verticalShift.current + 20),
      vec(horizontalShift * 2.3, verticalShift.current),
    ];
  }, [verticalShift]);

  const gradientStart = useComputedValue(() => {
    return vec(0, verticalShift.current);
  }, [verticalShift]);

  const gradientEnd = useComputedValue(() => {
    return vec(0, verticalShift.current + 150);
  }, [verticalShift]);

  const getLabelYValueOffset = (position: number | undefined) => {
    if (position === undefined) return undefined;
    return verticalShiftConst + 50 * position;
  };

  const getYLabelValue = (position: number) => {
    const r = `${position}%`;
    if (r === "10%") return "0%";
    return r;
  };

  const alertValue = () => {
    const adjustedShift =
      (verticalShiftConst - verticalShift.current) /
        (height - verticalShiftConst) +
      1;

    Alert.alert("VALUE", `Your value is: ${Math.round(adjustedShift * 100)}`);
  };

  if (!font) {
    return <View />;
  }

  return (
    <Canvas style={{ flex: 1 }}>
      {indicatorArray.map((val, i) => {
        return (
          <Text
            key={val.toString()}
            x={50}
            y={getLabelYValueOffset(labels[i])}
            text={
              labels[i] === 0
                ? getYLabelValue(100)
                : getYLabelValue((indicatorArray.length - i - 1) * 10)
            }
            font={font}
            color={Colors[colorScheme ?? "light"].text}
          />
        );
      })}
      <Path path={animatedPath} style="fill">
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={["#0AEF72", "#1F7446"]}
        />
      </Path>
      <Vertices vertices={trianglePath} color={"#767676"} />
    </Canvas>
  );
}

function convertPercentage(value: number): number {
  // if (value < 0 || value > 100) {
  //   throw new Error("Value must be between 0 and 100");
  // }

  // Cubic bezier control points
  const p0 = { x: 0, y: 580 };
  const p1 = { x: 0.25, y: 480 };
  const p2 = { x: 0.75, y: 280 };
  const p3 = { x: 1, y: 100 };

  const cubicBezier = (
    t: number,
    p0: number,
    p1: number,
    p2: number,
    p3: number
  ) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    let p = uuu * p0; // (1-t)^3 * p0
    p += 3 * uu * t * p1; // 3 * (1-t)^2 * t * p1
    p += 3 * u * tt * p2; // 3 * (1-t) * t^2 * p2
    p += ttt * p3; // t^3 * p3

    return p;
  };

  const mappedValue = cubicBezier(value / 100, p0.y, p1.y, p2.y, p3.y);

  return Math.round(mappedValue);
}
