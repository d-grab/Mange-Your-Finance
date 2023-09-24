import {
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useLogout } from "../../firebase/useLogout";
import { Snackbar } from "react-native-paper";
import { useState, useEffect } from "react";
import Colors from "../../constants/Colors";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { hideUsername } from "../Modify/EditProfile";
import { useFirestore } from "../../firebase/useFirestore";
import getLevelInfo, { calculateTotalAmount } from "../../gamification/utils";
import { setLevel } from "../../store/slices/levelSlice";
import getCurrencySymbol from "../../utils/CurrencySymbols";

export default function Profile(props: any) {
  const user = useSelector((state: RootState) => state.user);
  const reloadState = useSelector((state: RootState) => state.reload);
  const code = useSelector((state: RootState) => state.currency.code);
  const avatar = useSelector((state: RootState) => state.avatar.path);
  const dispatch = useDispatch();

  //
  const { logout } = useLogout();
  const colorScheme = useColorScheme();
  const [toggleSnackbar, setToggleSnackbar] = useState<boolean>(false);

  //
  const { getDocument } = useFirestore("savings", user.uid!);

  //
  const [levelInfo, setLevelInfo] = useState<{
    level: number;
    target: number;
    title: string;
    current: number;
  } | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });

  //
  const load = () => {
    getDocument()
      .then((doc) => {
        if (doc?.docs !== undefined) {
          const calculate = calculateTotalAmount(doc?.docs);
          const info = getLevelInfo(calculate);
          setLevelInfo({
            current: calculate,
            level: info?.level || 0,
            target: info?.target || 0,
            title: info?.title || "",
          });

          dispatch(
            setLevel({
              current: calculate,
              level: info?.level || 0,
              target: info?.target || 0,
              title: info?.title || "",
            })
          );
        }
      })
      .catch(() => {
        setOpenSnackbar({ open: true, msg: "Error please start app." });
      });
  };

  // loading savings
  useEffect(() => load(), [reloadState]);

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <View className="flex justify-center items-center pt-2">
          <View className="flex mb-1 justify-between flex-row items-center w-full">
            <Text className="text-2xl font-semibold py-2 tracking-wider pl-4">
              Profile
            </Text>
            <TouchableOpacity
              className="py-4 px-4"
              onPress={() => props.navigation.navigate("Notifications")}
            >
              <Feather name="bell" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="w-full pt-1">
            <View className="pl-6 py-3 flex w-full justify-start items-start">
              <Text
                className="font-semibold tracking-wider"
                style={{ color: "#767676" }}
              >
                Account
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Gamification")}
              className="flex pl-8 space-x-6 mb-5 flex-row justify-start items-center"
            >
              <View className="relative">
                <Image
                  className="rounded-full"
                  style={{ width: 60, height: 60, resizeMode: "stretch" }}
                  source={avatar}
                />
                <View
                  className="absolute"
                  style={{
                    backgroundColor: "transparent",
                    bottom: -18,
                    right: -18,
                  }}
                >
                  <Image
                    className="rounded-full"
                    style={{ width: 45, height: 45, resizeMode: "stretch" }}
                    source={require("../../assets/images/star.png")}
                  />
                  <Text
                    className="absolute tracking-widest text-center w-5"
                    style={{ top: 16, right: 13, fontWeight: "900" }}
                  >
                    {levelInfo?.level}
                  </Text>
                </View>
              </View>
              <View>
                <Text className="font-semibold tracking-wider text-xl">
                  {user?.name || "New user"}
                </Text>
                <Text
                  className="tracking-wider text-base text-center font-semibold"
                  style={{ color: "#767676" }}
                >
                  {hideUsername(user.email)}
                </Text>
              </View>
            </TouchableOpacity>
            <View className="w-full">
              <TouchableOpacity
                className="pl-8 py-3 flex flex-row w-full justify-start items-center"
                onPress={() => props.navigation.navigate("Currency")}
              >
                <Text className="font-semibold pr-3 tracking-wider text-base">
                  Currency
                </Text>
                <Text className="font-semibold tracking-wider text-base">
                  {getCurrencySymbol(code)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="pl-8 py-3 flex flex-row w-full justify-start items-center"
                onPress={() => setToggleSnackbar(true)}
              >
                <MaterialCommunityIcons name="logout" size={17} color="black" />
                <Text className="pl-5 font-semibold tracking-wider text-base">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View
              style={{
                borderTopWidth: 6,
                borderTopColor: colorScheme === "light" ? "#f5f5f5" : "#767676",
              }}
            />
            <View className="w-full">
              <View className="pl-6 py-3 flex w-full justify-start items-start">
                <Text
                  className="font-semibold tracking-wider"
                  style={{ color: "#767676" }}
                >
                  Ranking
                </Text>
              </View>
              <TouchableOpacity
                className="pl-8 py-3 flex w-full flex-row justify-start items-center"
                onPress={() => props.navigation.navigate("LeadersBoard")}
              >
                <Image
                  style={{ width: 30, height: 30, resizeMode: "stretch" }}
                  source={require("../../assets/leaders.png")}
                />
                <Text className="font-semibold tracking-wider pl-2 text-base">
                Leaderboard
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View
              style={{
                borderTopWidth: 6,
                borderTopColor: colorScheme === "light" ? "#f5f5f5" : "#767676",
              }}
            />
            <View className="w-full">
              <View className="pl-6 py-3 flex w-full justify-start items-start">
                <Text
                  className="font-semibold tracking-wider"
                  style={{ color: "#767676" }}
                >
                  Savings
                </Text>
              </View>
              <TouchableOpacity
                className="pl-8 py-3 flex w-full justify-start items-start"
                onPress={() => props.navigation.navigate("Savings")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Saving goals
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="pl-8 py-3 flex w-full justify-start items-start"
                onPress={() => props.navigation.navigate("GoalBasedSavings")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Goal based saving strategies
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="pl-8 py-3 flex w-full justify-start items-start"
                onPress={() => props.navigation.navigate("DailySavings")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Daily savings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="pl-8 py-3 flex w-full justify-start items-start"
                onPress={() => props.navigation.navigate("FinancialHome")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Financial education
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View
              style={{
                borderTopWidth: 6,
                borderTopColor: colorScheme === "light" ? "#f5f5f5" : "#767676",
              }}
            />

            {/* Assistance */}
            <View className="pl-6 py-3 flex w-full justify-start items-start">
              <Text
                className="font-semibold tracking-wider"
                style={{ color: "#767676" }}
              >
                Assistance
              </Text>
            </View>
            <TouchableOpacity
              className="pl-8 py-3 flex flex-row justify-start items-center"
              onPress={() => props.navigation.navigate("ChatHome")}
            >
              <MaterialIcons name="chat" size={17} color="black" />
              <Text className="font-semibold pl-5 tracking-wider text-base">
                Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="py-8 flex flex-row justify-center items-center">
          <Text
            className="font-semibold tracking-wider pr-1"
            style={{ color: "#767676" }}
          >
            Budget app
          </Text>
          <FontAwesome5 name="copyright" size={13} color="black" />
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "5%" }}
        visible={toggleSnackbar}
        onDismiss={() => setToggleSnackbar(false)}
        action={{
          label: "Yes",
          onPress: async () => {
            await logout();
          },
        }}
      >
        Are you sure?
      </Snackbar>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={openSnackbar.open}
        onDismiss={() => setOpenSnackbar({ ...openSnackbar, open: false })}
      >
        {openSnackbar.msg}
      </Snackbar>
    </SafeAreaView>
  );
}
