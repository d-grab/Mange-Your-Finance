import React, { useEffect, useState } from "react";

import { login as LoginState } from "../store/slices/userSlice";
// splash screen
import * as SplashScreen from "expo-splash-screen";
// firebase auth types and auth
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// importing redux provider
import { useDispatch } from "react-redux";

//importing screens
import WelcomeScreen from "../screens/Auth/Welcome";
import LoginScreen from "../screens/Auth/Login";
import MainTabs from "../screens/MainTabs";

import EditTransactions from "../screens/Modify/EditTransactions";
import Income from "../screens/Income";
import Spending from "../screens/Spending";
import EditPlan from "../screens/Modify/EditPlan";
import { useNetInfo } from "@react-native-community/netinfo";
import NoInternet from "../screens/NoInternet";
import Notifications from "../screens/Notifications";
import GoalBasedSavings from "../screens/Savings/GoalBasedSaving";
import Savings from "../screens/Savings/Savings";
import EditProfile from "../screens/Modify/EditProfile";
import AllTimeSavings from "../screens/Savings/AllTimeSavings";
import EditSavings from "../screens/Modify/EditSavings";
import Currency from "../screens/Currency";
import Gamification from "../screens/gamification/Home";
import SelectAvatar from "../screens/gamification/SelectAvatar";
import FullScreenAvatar from "../screens/gamification/FullScreenAvater";
import DailySavings from "../screens/Savings/DailySavings";
import ChatHome from "../screens/Chat/Home";
import ForgetPassword from "../screens/Auth/ForgetPassword";
import FinancialHome from "../screens/FinancialEdu/Home";
import FinancialContent from "../screens/FinancialEdu/Contents";
import LeadersBoard from "../screens/gamification/LeadersBoard";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function CheckAuth() {
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [isLogin, setIsLogin] = useState<boolean>(false);

  // on state changed
  async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      const u = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
      };

      dispatch(LoginState({ name: u.name!, email: u.email!, uid: u.uid }));
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    await SplashScreen.hideAsync();
  }

  useEffect(() => {
    const sub = auth().onAuthStateChanged(onAuthStateChanged);
    return sub;
  }, []);

  return (
    <>
      {isConnected === false && <NoInternet />}
      {isConnected === true && (
        <NavigationContainer>
          <Stack.Navigator>
            {isLogin ? (
              <Stack.Group>
                <Stack.Screen
                  name="Main"
                  options={{ headerShown: false }}
                  component={MainTabs}
                />
                <Stack.Screen
                  name="EditTransaction"
                  options={{ headerShown: false }}
                  component={EditTransactions}
                />
                <Stack.Screen
                  name="Income"
                  options={{ headerShown: false }}
                  component={Income}
                />
                <Stack.Screen
                  name="Spending"
                  options={{ headerShown: false }}
                  component={Spending}
                />
                <Stack.Screen
                  name="EditPlan"
                  options={{ headerShown: false }}
                  component={EditPlan}
                />
                <Stack.Screen
                  name="Notifications"
                  options={{ headerShown: false, presentation: "modal" }}
                  component={Notifications}
                />
                <Stack.Screen
                  name="GoalBasedSavings"
                  options={{ headerShown: false }}
                  component={GoalBasedSavings}
                />
                <Stack.Screen
                  name="LeadersBoard"
                  options={{ headerShown: false }}
                  component={LeadersBoard}
                />
                <Stack.Screen
                  name="EditProfile"
                  options={{ headerShown: false }}
                  component={EditProfile}
                />
                <Stack.Screen
                  name="Gamification"
                  options={{ headerShown: false }}
                  component={Gamification}
                />
                <Stack.Screen
                  name="Savings"
                  options={{ headerShown: false }}
                  component={Savings}
                />
                <Stack.Screen
                  name="AllTimeSavings"
                  options={{ headerShown: false }}
                  component={AllTimeSavings}
                />
                <Stack.Screen
                  name="EditSavings"
                  options={{ headerShown: false }}
                  component={EditSavings}
                />
                <Stack.Screen
                  name="FinancialHome"
                  options={{ headerShown: false }}
                  component={FinancialHome}
                />
                <Stack.Screen
                  name="FinancialContent"
                  options={{ headerShown: false }}
                  component={FinancialContent}
                />
                <Stack.Screen
                  name="Currency"
                  options={{ headerShown: false }}
                  component={Currency}
                />
                <Stack.Screen
                  name="SelectAvatar"
                  options={{ headerShown: false }}
                  component={SelectAvatar}
                />
                <Stack.Screen
                  name="FullScreenAvatar"
                  options={{ headerShown: false }}
                  component={FullScreenAvatar}
                />
                <Stack.Screen
                  name="DailySavings"
                  options={{ headerShown: false }}
                  component={DailySavings}
                />
                <Stack.Screen
                  name="ChatHome"
                  options={{ headerShown: false }}
                  component={ChatHome}
                />
                <Stack.Screen
                  name="ForgetPassword"
                  options={{ headerShown: false }}
                  component={ForgetPassword}
                />
              </Stack.Group>
            ) : (
              <Stack.Group>
                <Stack.Screen
                  name="Home"
                  options={{ headerShown: false }}
                  component={WelcomeScreen}
                />
                <Stack.Screen
                  name="Login"
                  options={{ headerShown: false }}
                  component={LoginScreen}
                />
                <Stack.Screen
                  name="ForgetPassword"
                  options={{ headerShown: false }}
                  component={ForgetPassword}
                />
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
