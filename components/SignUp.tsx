import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import {
  ValEmail,
  ValName,
  ValPassword,
  ConPassword,
} from "../constants/Validations";
import { StatusBar } from "expo-status-bar";
import { useSignUp } from "../firebase/useSignUp";
import { Snackbar } from "react-native-paper";
import { triggerNotifications } from "../utils/Notifications";
import { useFirestore } from "../firebase/useFirestore";
import { Auth } from "../firebase/init";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/userSlice";
import { Avatars } from "../gamification/Avatars/_Paths";

const { height } = Dimensions.get("window");

export interface Payload {
  name?: string;
  email?: string;
  password?: string;
  cPassword?: string;
  isName?: boolean | null;
  isEmail?: boolean | null;
  isPass?: boolean | null;
  isPassMatched?: boolean | null;
}

export const initialPayload: Payload = {
  name: "",
  email: "",
  password: "",
  cPassword: "",
  isName: null,
  isEmail: null,
  isPass: null,
  isPassMatched: null,
};

export default function SignUp({ flatListRef }: { flatListRef: any }) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  //
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [payload, setPayload] = useState<Payload>(initialPayload);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleSnackbar, setToggleSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });

  //
  const { signup } = useSignUp();
  const { addDocument } = useFirestore("currency", "");
  const { addDocument: addGamification } = useFirestore("gamification", "");
  const { addDocument: addLeadersBoard } = useFirestore("leadersboard", "");

  const handleSubmit = async () => {
    setIsLoading(true);
    const { isName, isEmail, isPass, isPassMatched } = payload;

    if (isName && isEmail && isPass && isPassMatched) {
      try {
        await signup(payload.email!, payload.password!, payload.name!);

        await addDocument({ code: "GBP" });
        await addGamification({ avatar: "1" });
        await addLeadersBoard({
          displayName: Auth.currentUser?.displayName,
          totalSavings: 0,
          avatar: Avatars[0].uri,
        });

        dispatch(
          login({
            name: Auth.currentUser?.displayName!,
            email: Auth.currentUser?.email!,
            uid: Auth.currentUser?.uid!,
          })
        );

        triggerNotifications("Sign Up Successful", null);
      } catch (error: any) {
        setToggleSnackbar({
          open: true,
          msg:
            error.code === "auth/email-already-in-use"
              ? "Email already in use"
              : "Invalid Credentials",
        });
        setIsLoading(false);
        return;
      }

      setPayload(initialPayload);
      setIsLoading(false);
      return;
    }

    setPayload({ isEmail: false, isPass: false });
    setIsLoading(false);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "dark"} />
      <View className="space-y-2 px-2">
        <View className="flex justify-center items-center pt-10">
          {colorScheme === "light" ? (
            <Image
              style={{
                resizeMode: "contain",
                width: height > 690 ? 280 : 250,
                height: height > 690 ? 280 : 250,
              }}
              source={require("../assets/images/logo.png")}
            />
          ) : (
            <Image
              style={{
                resizeMode: "contain",
                width: height > 690 ? 280 : 250,
                height: height > 690 ? 280 : 250,
              }}
              source={require("../assets/images/logo-dark.png")}
            />
          )}
        </View>
        <View>
          <View className="space-y-1">
            <Text className="dark:text-white text-base font-semibold">
              Username
            </Text>
            <TextInput
              className="border-2 py-2 px-3 dark:text-white rounded-full"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g Daniel"
              keyboardType="default"
              value={payload.name}
              onChangeText={(text) =>
                setPayload({ ...payload, name: text, isName: ValName(text) })
              }
            />
            <Text
              className="text-right text-red-700 opacity-1 mr-2"
              style={{ opacity: payload.isName === false ? 1 : 0 }}
            >
              Invalid Name
            </Text>
          </View>
          <View className="space-y-1">
            <Text className="dark:text-white text-base font-semibold">
              Email
            </Text>
            <TextInput
              className="border-2 py-2 px-3 dark:text-white rounded-full"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g username@domain.com"
              keyboardType="default"
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
              Invalid Email
            </Text>
          </View>
          <Text className="dark:text-white text-lg font-semibold mb-1">
            Password
          </Text>
          <View className="flex flex-row">
            <TextInput
              className="py-2 px-3 dark:text-white rounded-l-full w-11/12"
              style={{
                borderColor: "grey",
                borderLeftWidth: 2,
                borderBottomWidth: 2,
                borderTopWidth: 2,
              }}
              placeholder="*****"
              secureTextEntry={!showPassword}
              placeholderTextColor="grey"
              keyboardType="default"
              value={payload.password}
              onChangeText={(text) =>
                setPayload({
                  ...payload,
                  password: text,
                  isPass: ValPassword(text),
                  isPassMatched: ConPassword(text, payload.cPassword!),
                })
              }
            />
            <Pressable
              className="rounded-r-full h-full flex justify-between items-center py-3 pr-2"
              onPress={() => setShowPassword(!showPassword)}
              style={{
                borderColor: "grey",
                borderRightWidth: 2,
                borderBottomWidth: 2,
                borderTopWidth: 2,
              }}
            >
              {showPassword ? (
                <FontAwesome5
                  name="eye"
                  size={18}
                  color={Colors[colorScheme ?? "light"].text}
                />
              ) : (
                <FontAwesome5
                  name="eye-slash"
                  size={16}
                  color={Colors[colorScheme ?? "light"].text}
                />
              )}
            </Pressable>
          </View>
          <Text
            className="text-right text-red-700 mt-1 mr-2"
            style={{ opacity: payload.isPass === false ? 1 : 0 }}
          >
            Minimum 6 characters
          </Text>
          <View className="space-y-1">
            <Text className="dark:text-white text-base font-semibold">
              Confirm Password
            </Text>
            <TextInput
              className="py-2 px-3 dark:text-white rounded-full"
              style={{
                borderColor: "grey",
                borderWidth: 2,
              }}
              placeholder="*****"
              secureTextEntry={!showPassword}
              placeholderTextColor="grey"
              keyboardType="default"
              value={payload.cPassword}
              onChangeText={(text) =>
                setPayload({
                  ...payload,
                  cPassword: text,
                  isPassMatched: ConPassword(payload.password!, text),
                })
              }
            />
            <Text
              className="text-right text-red-700 mt-1 mr-2"
              style={{ opacity: payload.isPassMatched === false ? 1 : 0 }}
            >
              Password does not matched
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="flex justify-between items-center flex-row py-4 rounded-full"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          onPress={() => handleSubmit()}
        >
          <Entypo
            name="chevron-right"
            size={1}
            className="opacity-1"
            color={Colors[colorScheme ?? "light"].tint}
          />
          <Text style={{ color: "white" }} className="text-sm tracking-wide ">
            {isLoading ? "Loading..." : "Register"}
          </Text>
          <Entypo name="chevron-right" size={20} color={"white"} />
        </TouchableOpacity>
        <View className="flex flex-row justify-center items-center pb-5">
          <Text>Already registered?</Text>
          <TouchableOpacity
            className="py-2 px-3"
            onPress={() =>
              flatListRef.current?.scrollToIndex({ animated: true, index: 0 })
            }
          >
            <Text
              style={{ color: Colors[colorScheme ?? "light"].tint }}
              className="font-bold tracking-wider"
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    </ScrollView>
  );
}
