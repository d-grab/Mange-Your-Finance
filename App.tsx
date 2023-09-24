import * as React from "react";
import { Platform, useColorScheme, LogBox } from "react-native";
LogBox.ignoreAllLogs()

// importing redux provider
import { store } from "./store/index";
import { Provider } from "react-redux";

import "./constants/global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import CheckAuth from "./context/CheckAuth";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  const colorScheme = useColorScheme();

  const [expoPushToken, setExpoPushToken] = React.useState<any>("");
  const [notification, setNotification] = React.useState<any>(false);
  const notificationListener = React.useRef<any>();
  const responseListener = React.useRef<any>();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <CheckAuth />
      </ThemeProvider>
    </Provider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}
