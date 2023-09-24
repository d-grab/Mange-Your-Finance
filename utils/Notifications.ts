import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Auth } from "../firebase/init";

export interface NotificationData {
  title: string;
  body: { body: string; dateTime: number } | null;
}

export const triggerNotifications = async (
  title: string,
  body: string | null
) => {
  try {
    const notification: Notifications.NotificationRequestInput = {
      content: {
        title: title,
        body: body,
        // data: { data: "goes here" },
      },
      trigger: null,
    };

    await Notifications.scheduleNotificationAsync(notification);

    await storeNotification({
      title,
      body: { body: body === null ? "" : body, dateTime: Date.now() },
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

export const storeNotification = async (notification: NotificationData) => {
  try {
    const notifications = await getNotifications();

    const updatedNotifications =
      notifications !== null ? JSON.parse(notifications) : [];
    updatedNotifications.push(notification);

    const jsonValue = JSON.stringify(updatedNotifications);

    await AsyncStorage.setItem(
      `${Auth.currentUser?.uid.slice(0, 7)}-notifications-budget-app`,
      jsonValue
    );
  } catch (error) {
    console.error("Error storing notification:", error);
  }
};

export const getNotifications = async (): Promise<string | null> => {
  try {
    const notifications = await AsyncStorage.getItem(
      `${Auth.currentUser?.uid.slice(0, 7)}-notifications-budget-app`
    );

    return notifications;
  } catch (error) {
    console.error("Error getting notifications:", error);
    return null;
  }
};

export const deleteNotification = async (index: number) => {
  try {
    const notifications = await getNotifications();

    if (notifications) {
      const parsedNotifications: NotificationData[] = JSON.parse(notifications);

      if (index >= 0 && index < parsedNotifications.length) {
        parsedNotifications.splice(index, 1);

        const jsonValue = JSON.stringify(parsedNotifications);

        await AsyncStorage.setItem(
          `${Auth.currentUser?.uid.slice(0, 7)}-notifications-budget-app`,
          jsonValue
        );
      }
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
};
