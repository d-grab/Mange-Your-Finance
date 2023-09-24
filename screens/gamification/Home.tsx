import {
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Snackbar } from "react-native-paper";
import RenderAmount from "../../components/RenderAmount";

export interface Payload {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  cPassword?: string;
  isName?: boolean | null;
  isEmail?: boolean | null;
  isNewPass?: boolean | null;
  isPassMatched?: boolean | null;
  isOldPass?: boolean | null;
}

export const initialPayload: Payload = {
  newPassword: "",
  cPassword: "",
  oldPassword: "",
  isName: null,
  isEmail: null,
  isNewPass: null,
  isPassMatched: null,
  isOldPass: null,
};

export default function Gamification(props: any) {
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);
  const levelInfo = useSelector((state: RootState) => state.levels);
  const avatar = useSelector((state: RootState) => state.avatar.path);
  const balances = useSelector((state: RootState) => state.balances);

  const [toggleSnackbar, setToggleSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });
  const [showEmail, setShowEmail] = useState<boolean>(false);

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        {/* header */}
        <View className="w-full flex flex-row justify-start items-center">
          <TouchableOpacity
            className="py-2 px-3"
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={26}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text className="text-xl flex-1 pl-3 font-bold tracking-wider text-start py-2">
            Profile
          </Text>
        </View>
        <View className="flex justify-center items-center space-y-3 pt-3 pb-5">
          {/* Profile picture */}
          <TouchableOpacity
            onPress={() => props.navigation.navigate("FullScreenAvatar")}
            className="rounded-full relative"
          >
            <Image
              className="rounded-full"
              style={{
                width: 120,
                height: 120,
                resizeMode: "stretch",
              }}
              source={avatar}
            />
            <TouchableOpacity
              className="absolute rounded-full py-2 px-2"
              onPress={() => props.navigation.navigate("SelectAvatar")}
              style={{
                top: -12,
                right: -12,
                zIndex: 10000,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
            >
              <FontAwesome name="pencil" size={24} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
          <View className="px-3">
            <Text
              className="text-xl text-center font-semibold"
              style={{ color: Colors[colorScheme ?? "light"].text }}
            >
              {user.name}
            </Text>
            <View className="flex flex-row justify-center items-center space-x-3">
              <Text
                className="tracking-wider text-base text-center font-semibold"
                style={{ color: "#767676" }}
              >
                {showEmail ? user.email : hideUsername(user.email)}
              </Text>
              <Pressable
                onPress={() => setShowEmail(!showEmail)}
                className="py-2 px-2"
              >
                {showEmail ? (
                  <FontAwesome5
                    name="eye"
                    size={18}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                ) : (
                  <FontAwesome5
                    name="eye-slash"
                    size={18}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                )}
              </Pressable>
            </View>
          </View>

          <View className="flex flex-row justify-start items-center w-full pl-3">
            <View className="flex-1 relative">
              <View
                style={{
                  height: 25,
                  width: "100%",
                  backgroundColor: "rgba(59, 114, 80, 0.2)",
                }}
                className="rounded-lg"
              >
                <View
                  style={{
                    width: `${(levelInfo.current / levelInfo.target) * 100}%`,
                    height: "100%",
                    backgroundColor: "#fdd300",
                  }}
                  className="rounded-lg"
                />
                <Text className="absolute text-sm w-full text-center pt-1 font-semibold tracking-wider">
                  {`${levelInfo.current} / ${levelInfo.target}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "transparent",
                zIndex: 100,
                left: -30,
              }}
            >
              <Image
                className="rounded-full"
                style={{ width: 60, height: 60, resizeMode: "stretch" }}
                source={require("../../assets/images/star.png")}
              />
              <Text
                className="absolute tracking-widest w-5 text-center"
                style={{ top: 24, right: 20, fontWeight: "900" }}
              >
                {levelInfo.level}
              </Text>
            </View>
          </View>
          <View className="relative -top-4">
            <Text className="font-semibold tracking-wider w-full text-start text-base">
              {levelInfo.title}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="px-3 space-y-4">
          {/* Current  */}
          <View className="flex flex-row justify-between items-center">
            <Text className="font-semibold tracking-wider text-lg">
              Current balance:{" "}
            </Text>
            <Text className="font-semibold tracking-wider text-lg">
              <RenderAmount amount={balances.currentBalance} />
            </Text>
          </View>

          {/* Total Earned */}
          <View className="flex flex-row justify-between items-center">
            <Text className="font-semibold tracking-wider text-lg">
              Total Income:{" "}
            </Text>
            <Text className="font-semibold tracking-wider text-lg">
              <RenderAmount amount={balances.incomeBalance} />
            </Text>
          </View>

          {/* Total Expense */}
          <View className="flex flex-row justify-between items-center">
            <Text className="font-semibold tracking-wider text-lg">
              Total Spendings:{" "}
            </Text>
            <Text className="font-semibold tracking-wider text-lg">
              <RenderAmount amount={balances.outcomeBalance} />
            </Text>
          </View>
        </View>
        {/* name / passwrod */}
        <View className="py-10">
          <TouchableOpacity
            className="pl-4 py-4 flex w-full justify-start items-start"
            onPress={() => props.navigation.navigate("EditProfile")}
          >
            <Text className="font-semibold tracking-wider text-base">
              Name / Password
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={toggleSnackbar?.open}
        onDismiss={() => setToggleSnackbar({ ...toggleSnackbar!, open: false })}
        action={{
          label: "Close",
          onPress: () => setToggleSnackbar({ ...toggleSnackbar!, open: false }),
        }}
      >
        {toggleSnackbar?.msg}
      </Snackbar>
    </SafeAreaView>
  );
}

export function hideUsername(email: string): string {
  const atIndex = email.indexOf("@");

  if (atIndex !== -1) {
    const hiddenUsername = "*".repeat(atIndex) + email.substring(atIndex);
    return hiddenUsername;
  }

  return email;
}
