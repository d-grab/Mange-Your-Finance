import { StatusBar } from "expo-status-bar";
import { View, Text, Dimensions, Image } from "react-native";

// Importing constants and components
import { SafeAreaView } from "react-native-safe-area-context";

// Getting the device width
const { width, height } = Dimensions.get("window");

const img = require("../assets/images/no-internet.png");

// MainScreen component
export default function NoInternet() {
  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <View>
        <View className="flex justify-center items-center">
          <Image
            style={{
              width: width / 1.1,
              height: height / 2,
              resizeMode: "stretch",
            }}
            source={img}
          />
        </View>
        <View className="space-y-1 mt-5">
          <Text
            className="text-2xl text-center font-bold"
            style={{ color: "black" }}
          >
            Your connection is lost.
          </Text>
          <Text
            className="tracking-wider text-base text-center font-semibold"
            style={{ color: "#767676" }}
          >
            Please check your internet connection.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
