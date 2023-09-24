import {
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { Text, View } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import RenderAmount from "../../components/RenderAmount";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState, useEffect, useCallback } from "react";
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Easing,
  runTiming,
  useFont,
  useValue,
} from "@shopify/react-native-skia";
import { PixelRatio } from "react-native";
import { DonutChart } from "../../components/DonutChart";
import Slider from "rn-range-slider";
import { StyleSheet } from "react-native";
import Thumb from "../../components/Slider/Thumb";
import RailSelected from "../../components/Slider/RailSelected";
import Rail from "../../components/Slider/Rail";
import Notch from "../../components/Slider/Notch";
import Label from "../../components/Slider/Label";

const { height } = Dimensions.get("window");
const radius = PixelRatio.roundToNearestPixel(100);
const STROKE_WIDTH = 12;

export default function DailySavings(props: any) {
  const colorScheme = useColorScheme();
  const balances = useSelector((state: RootState) => state.balances);
  const user = useSelector((state: RootState) => state.user);

  //
  const [saveAmount, setSaveAmount] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [dailySaving, setDailySaving] = useState<number>();
  const [daily, setDaily] = useState<number>();
  const [weekly, setWeekly] = useState<number>();
  const [weeklySaving, setWeeklySaving] = useState<number>();
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });

  //  Slider
  const renderThumb = useCallback(
    (name: "high" | "low") => <Thumb name={name} />,
    []
  );
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback(
    (lowValue: any, highValue: any) =>
      setSaveAmount((lowValue || 0).toFixed(2)),
    []
  );

  const load = async () => {
    try {
      setDaily(balances.currentBalance / 30);
      let value = await AsyncStorage.getItem(
        "savings-budget-app" + user.uid?.slice(0, 7)
      );
      if (value != null) {
        const { saveAmount } = JSON.parse(value);
        const per = ((balances.currentBalance / 30) * +saveAmount) / 100;

        setDaily(balances.currentBalance / 30  - per);
        setWeekly((balances.currentBalance / 30 - per) * 7);
        setDailySaving(per);
        setSaveAmount(saveAmount);
        setWeeklySaving(per * 7);
      } else {
        setDailySaving(0);
        setDaily(balances.currentBalance / 30);
        setWeekly(balances.currentBalance / 4);
        setWeeklySaving(0);
      }
    } catch (e) {
      setDailySaving(0);
      setDaily(balances.currentBalance / 30);
      setWeekly(balances.currentBalance / 4);
      setWeeklySaving(0);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const animationState = useValue(0);

  useEffect(() => {
    animationState.current = 0;
    runTiming(animationState, +saveAmount / 100, {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [saveAmount]);

  const font = useFont(require("../../assets/fonts/Roboto-Medium.ttf"), 45);
  const smallerFont = useFont(
    require("../../assets/fonts/Roboto-Medium.ttf"),
    15
  );

  if (!font || !smallerFont) {
    return <View />;
  }

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (+saveAmount >= 0 && +saveAmount <= 100) {
        const per = ((balances.currentBalance / 30) * +saveAmount) / 100;

        setDailySaving(per);
        setWeekly((balances.currentBalance / 30 - per) * 7);
        daily != undefined && setDaily(balances.currentBalance / 30 - per);
        setWeeklySaving(per * 7);

        if (daily != undefined) {
          const jsonValue = JSON.stringify({
            saveAmount: saveAmount,
          });

          await AsyncStorage.setItem(
            "savings-budget-app" + user.uid?.slice(0, 7),
            jsonValue
          );
        }
      } else {
        setOpenSnackbar({ open: true, msg: "Invalid percentage" });
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <View className="flex-row flex mt-2 justify-start items-center">
          <TouchableOpacity
            className="py-2 px-3"
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={height > 630 ? 26 : 20}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text
            style={{ fontSize: 20 }}
            className="flex-1 pl-3 font-bold tracking-wider text-start py-2"
          >
            Daily savings
          </Text>
        </View>
        <View className="pt-7">
          {/* <View
            style={{ paddingTop: 40, paddingBottom: 30 }}
            className="w-full space-y-1"
          >
            <Text className="px-4 font-bold text-3xl w-full text-center tracking-widest">
              <RenderAmount amount={balances.currentBalance || 0} />
            </Text>
            <Text
              style={{ color: "#767676" }}
              className="dark:text-white text-center w-full text-xl font-semibold"
            >
              Income
            </Text>
          </View> */}
          <View
            className="flex justify-center items-center rounded-lg pb-3"
            style={{
              marginLeft: 10,
              marginRight: 13,
            }}
          >
            <View className="flex justify-center items-center rounded-lg">
              <View style={{ width: radius * 2, height: radius * 2 }}>
                <DonutChart
                smallerTextX={1.5}
                  backgroundColor={Colors[colorScheme ?? "light"].background}
                  radius={radius}
                  smallerText="Daily saving"
                  strokeWidth={STROKE_WIDTH}
                  percentageComplete={animationState}
                  targetPercentage={+saveAmount}
                  font={font}
                  smallerFont={smallerFont}
                  is100Mode={true}
                />
              </View>
            </View>
          </View>
          <View className="px-5 space-y-3 pt-4">
            {/*  */}
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676", fontSize: height > 630 ? 19 : 17 }}
                className="dark:text-white text-start font-semibold"
              >
                Daily Spending Limit
              </Text>
              <Text
                style={{ fontSize: height > 630 ? 19 : 17 }}
                className="px-4 font-bold text-center tracking-widest"
              >
                <RenderAmount amount={+(daily || 0).toFixed(2) || 0} />
              </Text>
            </View>
            {/*  */}
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676", fontSize: height > 630 ? 19 : 17 }}
                className="dark:text-white text-start font-semibold"
              >
                Weekly Spending Limit
              </Text>
              <Text
                style={{ fontSize: height > 630 ? 19 : 17 }}
                className="px-4 font-bold text-center tracking-widest"
              >
                <RenderAmount amount={+(weekly || 0).toFixed(2) || 0} />
              </Text>
            </View>
          </View>
          <View className="pt-3 px-5 space-y-3">
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676", fontSize: height > 630 ? 19 : 17 }}
                className="dark:text-white text-start font-semibold"
              >
                Daily saving
              </Text>
              <Text
                style={{ fontSize: height > 630 ? 19 : 17 }}
                className="px-4 font-bold text-center tracking-widest"
              >
                <RenderAmount amount={+(dailySaving || 0).toFixed(2) || 0} />
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676", fontSize: height > 630 ? 19 : 17 }}
                className="dark:text-white text-start font-semibold"
              >
                Weekly saving
              </Text>
              <Text
                style={{ fontSize: height > 630 ? 19 : 17 }}
                className="px-4 font-bold text-center tracking-widest"
              >
                <RenderAmount amount={+(weeklySaving || 0).toFixed(2) || 0} />
              </Text>
            </View>
          </View>
          <View className="px-5 pt-4">
            <View className="p1-3">
              <Text
                style={{ color: "#767676" }}
                className="dark:text-white text-start text-base font-semibold pb-1"
              >
                Daily savings percentage %
              </Text>
              {/* <TextInput
                className="py-2 px-3 dark:text-white rounded-lg"
                style={{ borderColor: "grey", borderWidth: 2 }}
                placeholder="0"
                placeholderTextColor="grey"
                keyboardType="numeric"
                value={saveAmount >= "0" ? `${saveAmount}` : ""}
                onChangeText={(text) => {
                  setSaveAmount(text);
                }}
              /> */}
            </View>
            <View>
              <Slider
              style={{height: 60, paddingTop: 10}}
                min={0}
                max={100}
                step={1}
                low={+saveAmount}
                floatingLabel
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                disableRange
                onValueChanged={handleValueChange}
              />
            </View>
            <TouchableOpacity
              disabled={loading}
              onPress={() => onSubmit()}
              className="flex justify-center items-center rounded-lg"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text className="text-white py-3">
                {loading ? "Loading..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-5 pt-5 pb-10">
          <Text
            style={{
              color: "#767676",
              fontSize: height > 630 ? 19 : 16,
              lineHeight: height > 630 ? 30 : 25,
            }}
            className="dark:text-white w-full text-center font-semibold pb-1 px-3"
          > Based on your Balance :{'\n'}
            By saving <Text style={{ fontWeight: 'bold' }}>{saveAmount || 0}%</Text> each day, you can
            accumulate savings of{" "}
            <Text style={{ fontWeight: 'bold' }}><RenderAmount amount={+(dailySaving || 0).toFixed(2) || 0} /> </Text>a Day{'\n'}
            and {" "}
            <Text style={{ fontWeight: 'bold' }}><RenderAmount amount={+(weeklySaving || 0).toFixed(2) || 0} />{" "}
            </Text>a Week.
          </Text>
        </View>
      </ScrollView>
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

const styles = StyleSheet.create({
  root: {
    alignItems: "stretch",
    padding: 12,
    flex: 1,
    backgroundColor: "#555",
  },
  slider: {},
  button: {},
  header: {
    alignItems: "center",
    backgroundColor: "black",
    padding: 12,
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  valueText: {
    width: 50,
    color: "white",
    fontSize: 20,
  },
});
