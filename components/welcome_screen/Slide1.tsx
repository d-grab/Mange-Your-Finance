import { Text, View } from "../Themed";
import Colors from "../../constants/Colors";
import { Dimensions, Image, useColorScheme } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Slide1() {
  const colorScheme = useColorScheme();
  return (
    <>
      <View className="flex justify-start items-center">
        <Image
          style={{
            width,
            height: height < 630 ? height / 1.9 : height / 1.7,
            resizeMode: "cover",
          }}
          source={require("../../assets/images/slide1.jpg")}
        />
        <View className="space-y-2 mt-4 px-3">
          <Text
            className="text-xl text-center font-semibold"
            style={{ color: Colors[colorScheme ?? "light"].text }}
          >
            Welcome to Budget app.
          </Text>
          <Text
            className="tracking-wider text-center font-semibold pb-4"
            style={{
              color: "#767676",
              fontSize: height > 690 ? 16 : 15,
              lineHeight: 24,
            }}
          >
            Welcome to Budget app. Track your expenses, create budgets, and
            watch your savings grow, all in one intuitive app.
          </Text>
        </View>
      </View>
    </>
  );
}
