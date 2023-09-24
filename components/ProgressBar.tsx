import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { View } from "./Themed";

export default function ProgressBar({ progress }: { progress: number }) {
  const colorScheme = useColorScheme();
  return (
    <>
      <View
        style={{
          height: 10,
          width: "100%",
          backgroundColor: "rgba(59, 114, 80, 0.2)",
          borderRadius: 5,
        }}
      >
        <View
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: Colors[colorScheme ?? "light"].tint,
            borderRadius: 5,
          }}
        />
      </View>
    </>
  );
}
