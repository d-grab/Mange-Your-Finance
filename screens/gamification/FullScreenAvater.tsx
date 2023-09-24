import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FadeInView } from "../../components/animations";

const { height } = Dimensions.get("window");

export default function FullScreenAvatar(props: any) {
  const colorScheme = useColorScheme();
  const avatar = useSelector((state: RootState) => state.avatar.path);

  const params = props.route.params;

  return (
    <SafeAreaView>
      <FadeInView _duration={500}>
        <ScrollView
          style={{
            height,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}
        >
          <View className="w-full flex flex-row justify-between items-center pt-4">
            <TouchableOpacity
              className="py-4 px-3"
              onPress={() => props.navigation.goBack()}
            >
              <Ionicons
                name="chevron-back-sharp"
                size={26}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
            <Text className="text-xl flex-1 pl-3 font-bold tracking-wider text-start py-4">
              Avatar
            </Text>
            <TouchableOpacity
              disabled={params != undefined}
              style={{ opacity: params != undefined ? 0 : 1 }}
              className="py-4 px-7"
              onPress={() => props.navigation.navigate("SelectAvatar")}
            >
              <FontAwesome name="pencil" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 flex justify-center items-center">
            <View
              style={{
                height: height / 1.5,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {params == undefined && (
                <Image
                  style={{ height: height / 2 }}
                  source={avatar}
                  resizeMode="cover"
                />
              )}
              {params != undefined && (
                <Image
                  style={{ height: height / 2 }}
                  source={params.avatar}
                  resizeMode="cover"
                />
              )}
            </View>
          </View>
        </ScrollView>
      </FadeInView>
    </SafeAreaView>
  );
}
