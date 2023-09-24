import { ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { deleteNotification, getNotifications } from "../utils/Notifications";
import { useEffect, useState } from "react";
import type { NotificationData } from "../utils/Notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Snackbar } from "react-native-paper";

const width = Dimensions.get("window").width;

export default function Notifications(props: any) {
  const colorScheme = useColorScheme();
  const [notifi, setNotifi] = useState<Array<NotificationData>>([]);
  const [reload, setReload] = useState<boolean>(false);
  const [toggleSnack, setToggleSnack] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const [deleteToggle, setDeleteToggle] = useState<boolean>(false);
  const [noNotifi, setNoNotifi] = useState<boolean>(false);

  const load = async () => {
    let resp = await getNotifications();
    resp === null ? setNotifi([]) : setNotifi(JSON.parse(resp));
  };

  load();
  useEffect(() => {}, [reload]);

  return (
    <SafeAreaView
      style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
      className="flex-1"
    >
      <ScrollView>
        <View className="flex-1 justify-start items-center pt-2">
          <View className="w-full flex flex-row justify-between items-center">
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
            <Text className="text-xl font-bold tracking-wider text-start pl-2 py-4">
              Notifications
            </Text>
            <TouchableOpacity
              className="py-4 px-5"
              onPress={() => {
                if (notifi.length === 0) {
                  setNoNotifi(true);
                  return;
                }
                setDeleteToggle(true);
              }}
            >
              <MaterialCommunityIcons
                name="delete-empty"
                size={27}
                color={"rgb(185 28 28)"}
              />
            </TouchableOpacity>
          </View>
          <View className="w-full flex flex-col justify-start items-start pt-5">
            {notifi?.length === 0 && (
              <Text className="text-base font-semibold tracking-wider w-full text-center">
                No Notifications
              </Text>
            )}
            {notifi?.reverse()?.map((e, i) => (
              <TouchableOpacity
                onLongPress={() => {
                  setIndex(i);
                  setToggleSnack(true);
                }}
                key={i}
                className="w-full flex flex-row justify-between items-center py-3"
              >
                <View
                  className="flex flex-col justify-start items-start"
                  style={{ width: width / 1.3 }}
                >
                  <Text className="text-lg pl-2 font-semibold tracking-widest">
                    {e.title}
                  </Text>
                  {e.body?.body !== "" && (
                    <Text
                      className="tracking-wider text-base text-start
                  pl-2 font-semibold"
                      style={{ color: "#767676" }}
                    >
                      {e.body?.body}
                    </Text>
                  )}
                </View>
                <Text
                  className="tracking-wider text-sm text-start font-semibold"
                  style={{ color: "#767676", width: width / 4 }}
                >
                  {e?.body?.dateTime !== undefined &&
                    formatTimeDifference(
                      Date.now() - (Date.now() - e?.body?.dateTime)
                    )}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={toggleSnack}
        onDismiss={() => setToggleSnack(false)}
        action={{
          label: "delete",
          onPress: () => {
            deleteNotification(index);
            setReload(!reload);
          },
        }}
      >
        Are you sure?
      </Snackbar>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={deleteToggle}
        onDismiss={() => setDeleteToggle(false)}
        action={{
          label: "All",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setReload(!reload);
            } catch {}
          },
        }}
      >
        Clear all?
      </Snackbar>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={noNotifi}
        onDismiss={() => setNoNotifi(false)}
      >
        No notification to delete
      </Snackbar>
    </SafeAreaView>
  );
}

function formatTimeDifference(dateTime: number) {
  const timeDifferenceInSeconds = Math.floor((Date.now() - dateTime) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} second${
      timeDifferenceInSeconds !== 1 ? "s" : ""
    }`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (timeDifferenceInSeconds < 2592000) {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""}`;
  } else if (timeDifferenceInSeconds < 31536000) {
    const months = Math.floor(timeDifferenceInSeconds / 2592000);
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(timeDifferenceInSeconds / 31536000);
    return `${years} year${years !== 1 ? "s" : ""}`;
  }
}
