import { View, useColorScheme } from "react-native";
import { Text } from "../Themed";
import Colors from "../../constants/Colors";
import RenderAmount from "../RenderAmount";
import ProgressBar from "../ProgressBar";

export default function Single({
  progress = 0,
  category,
  amount,
  title,
  currentAmount,
}: {
  currentAmount: number;
  category: string;
  amount: number;
  title: string;
  progress?: number;
}) {
  const colorScheme = useColorScheme();

  function calculatePercentage(): number {
    if (currentAmount) {
      return +currentAmount / +amount;
    }

    return 0;
  }

  return (
    <>
      <Text
        className="font-semibold tracking-wider rounded-lg pb-1"
        style={{
          color: Colors[colorScheme ?? "light"].tint,
        }}
      >
        #{category}
      </Text>
      <Text className="w-full pb-2 text-start text-xl font-bold tracking-widest">
        {title}
      </Text>
      <View className="pb-2 flex flex-row justify-between items-center">
        <Text className="text-base font-semibold tracking-widest">
          <RenderAmount amount={currentAmount || 0} />
        </Text>
        <Text className="text-base font-semibold tracking-widest">
          <RenderAmount amount={amount || 0} />
        </Text>
      </View>

      <ProgressBar progress={calculatePercentage()} />
    </>
  );
}
