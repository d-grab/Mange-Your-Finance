import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useState } from "react";
import { ValEmail } from "../../constants/Validations";
import { Auth } from "../../firebase/init";
import { Snackbar } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const { height } = Dimensions.get("window");

export default function ForgetPassword(props: any) {
  const colorScheme = useColorScheme();
  const avatar = useSelector((state: RootState) => state.avatar.path);

  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<{
    email: string;
    isEmail: boolean | null;
  }>({ email: "", isEmail: null });
  const [toggleSnackbar, setToggleSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "Invalid credentials" });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (payload.isEmail === true) {
        await Auth.sendPasswordResetEmail(payload.email).then(() => {
          setToggleSnackbar({ msg: "Reset email sent", open: true });
        });
      } else {
        setPayload({ ...payload, isEmail: false });
      }
    } catch (e: any) {
      if (e.code === "auth/user-not-found") {
        setToggleSnackbar({ msg: "User not registered", open: true });
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
        className="h-full"
      >
        <View className="flex-row flex pt-2 justify-start items-center">
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
        </View>
        <View className="flex justify-center items-center">
          {!Auth.currentUser?.uid ? (
            <>
              {colorScheme === "light" ? (
                <Image
                  style={{
                    resizeMode: "contain",
                    width: height > 690 ? 280 : height < 630 ? 220 : 250,
                    height: height > 690 ? 280 : height < 630 ? 220 : 250,
                  }}
                  source={require("../../assets/images/logo.png")}
                />
              ) : (
                <Image
                  style={{
                    resizeMode: "contain",
                    width: height > 690 ? 280 : height < 630 ? 220 : 250,
                    height: height > 690 ? 280 : height < 630 ? 220 : 250,
                  }}
                  source={require("../../assets/images/logo-dark.png")}
                />
              )}
            </>
          ) : (
            <TouchableOpacity
              onPress={() => props.navigation.navigate("FullScreenAvatar")}
              className="py-7"
            >
              <Image
                className="rounded-full"
                style={{
                  width: 130,
                  height: 130,
                  resizeMode: "stretch",
                }}
                source={avatar}
              />
            </TouchableOpacity>
          )}
        </View>
        <View className="px-3">
          <View className="space-y-1 scroll-pb-60">
            <Text className="dark:text-white text-lg font-semibold">Email</Text>
            <TextInput
              className="border-2 py-2 px-3 dark:text-white rounded-full"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g username@domain.com"
              keyboardType="email-address"
              value={payload.email}
              onChangeText={(text) =>
                setPayload({ ...payload, email: text, isEmail: ValEmail(text) })
              }
            />
            <Text
              className="text-right text-red-700 mr-2"
              style={{
                opacity: payload.isEmail === false ? 1 : 0,
              }}
            >
              Invalid email
            </Text>
          </View>
          <TouchableOpacity
            className="flex justify-between items-center flex-row rounded-full mt-2"
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].tint,
              paddingVertical: height > 690 ? 20 : height > 630 ? 18 : 14,
            }}
            onPress={() => handleSubmit()}
          >
            <Entypo
              name="chevron-right"
              size={1}
              className="opacity-0"
              color={Colors[colorScheme ?? "light"].tint}
            />
            <Text style={{ color: "white" }} className="text-sm tracking-wide ">
              {loading ? "Loading..." : "Send"}
            </Text>
            <Entypo name="chevron-right" size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={toggleSnackbar.open}
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
