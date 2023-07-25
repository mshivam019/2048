import * as Device from 'expo-device';
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import {  Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    cancelAllScheduledNotifications(); // Cancelling existing notifications

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(cancelAllScheduledNotifications());
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);   

  return (
    null
  );
}
export async function cancelAllScheduledNotifications() {
    try {
      const allScheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
      // Loop through each notification and cancel it individually
      for (const notification of allScheduledNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
      console.log("All scheduled notifications canceled successfully.");
    } catch (error) {
      console.log("Error while canceling scheduled notifications:", error);
    }
  }

export async function schedulePushNotification() {

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Play",
        body: "Come and have some fun!",
        // sound: 'default',
      },
      trigger: { seconds: 60*60,
        repeats: true,},
    });
    console.log("notif id on scheduling", id);
    return id;
  }
  
  
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: true,
      lightColor: "#FF231F7C",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  return token;
}


export async function cancelNotification(notifId){
  await Notifications.cancelScheduledNotificationAsync(notifId);
}