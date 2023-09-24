import { Text, View } from "./Themed";
import {
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Dimensions,
} from "react-native";
import Colors from "../constants/Colors";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import RenderAmount from "./RenderAmount";
import {
  Easing,
  runTiming,
  useFont,
  useValue,
} from "@shopify/react-native-skia";
import { PixelRatio } from "react-native";
import { DonutChart } from "./DonutChart";
import { useEffect } from "react";

const width = Dimensions.get("window").width;
const radius = PixelRatio.roundToNearestPixel(100);
const STROKE_WIDTH = 12;

export default function Savings(props: any) {
  const colorScheme = useColorScheme();
  return (
    <View className="px-2 mb-5">
      <View className="flex flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold dark:text-white">Savings</Text>
        <TouchableOpacity
          className="px-1 py-1"
          onPress={() => props.navigation.navigate("Savings")}
        >
          <Entypo
            name="chevron-right"
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      </View>
      {props.savings?.length === 0 ? (
        <Text className="w-full text-center pb-2 mt-2">No savings</Text>
      ) : (
        <FlatList
          className="mt-2 px-1"
          data={props?.savings}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._data.createdAt?.seconds}`}
          renderItem={(e: any) => {
            const { currentAmount, monthYear, targetAmount } =
              formatDateAndAmounts(e.item._data);

            return (
              <Single
                id={e.item.id}
                navigation={props.navigation}
                currentAmount={`${currentAmount}`}
                month={monthYear}
                amount={targetAmount}
                progress={
                  currentAmount !== 0 || targetAmount !== 0
                    ? currentAmount / targetAmount
                    : 0
                }
              />
            );
          }}
        />
      )}
    </View>
  );
}

export const Single = ({
  month,
  amount,
  progress,
  id,
  navigation,
  currentAmount,
}: {
  currentAmount?: string;
  month: string;
  amount: number;
  progress: number;
  id: string;
  navigation: any;
}) => {
  const colorScheme = useColorScheme();

  //skia animations
  const animationState = useValue(0);

  useEffect(() => {
    animationState.current = 0;
    runTiming(animationState, progress, {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [progress]);

  const font = useFont(require("../assets/fonts/Roboto-Medium.ttf"), 40);
  const smallerFont = useFont(require("../assets/fonts/Roboto-Medium.ttf"), 20);

  if (!font || !smallerFont) {
    return <View />;
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation !== null &&
        navigation.navigate("EditSavings", {
          id,
          month,
          amount,
          progress,
          currentAmount,
        })
      }
      className="px-3 flex justify-center items-center mr-10 py-4"
      style={{
        width: width - 30,
        backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
      }}
    >
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
        }}
        className="w-full flex flex-row justify-between items-center"
      >
        <Text className="text-start text-lg font-bold tracking-widest">
          {month}
        </Text>
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
          }}
          className="text-start flex flex-row justify-center items-center text-lg font-bold tracking-widest"
        >
          <Text className="pr-1">
            <RenderAmount amount={amount} />
          </Text>
          <MaterialCommunityIcons
            name="target"
            size={24}
            color={Colors[colorScheme ?? "light"].tint}
          />
        </View>
      </View>
      <View style={{ width: radius * 2, height: radius * 2 }}>
        <DonutChart
          smallerTextX={3}
          backgroundColor={Colors[colorScheme ?? "light"].secondaryBackground}
          radius={radius}
          strokeWidth={STROKE_WIDTH}
          percentageComplete={animationState}
          targetPercentage={progress}
          font={font}
          smallerFont={smallerFont}
        />
      </View>
    </TouchableOpacity>
  );
};

function formatDateAndAmounts(data: any) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const createdAt = new Date(data.createdAt.seconds * 1000);
  const monthYear = `${
    months[createdAt.getMonth()]
  } ${createdAt.getFullYear()}`;
  const targetAmount = data.targetAmount;
  const currentAmount = data.currentAmount;

  return { monthYear, targetAmount, currentAmount };
}
