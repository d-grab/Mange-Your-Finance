import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Single } from "../components/Transaction";
import { LineGraph } from "../components/LineGraph";
import { PieGraph } from "../components/PieGraph";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useFirestore } from "../firebase/useFirestore";
import formattedDate from "../utils/FormatDate";
import { Snackbar } from "react-native-paper";
import { reload } from "../store/slices/reloadSlice";
import { spendingByMonth, spendingByYear } from "../utils/GenChart";

export default function Spending(props: any) {
  // Using hooks to manage state and get color scheme
  const colorScheme = useColorScheme();
  const [labelI, setLabelI] = useState<number>(0);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const reloadState = useSelector((state: RootState) => state.reload);

  const { getDocument } = useFirestore("transactions", user.uid!);

  const [resp, setResp] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [toggleSnack, setToggleSnack] = useState<boolean>(false);
  const [chartDataByMonth, setChartDataByMonth] = useState<Array<number>>([0]);
  const [chartDataByYear, setChartDataByYear] = useState<any>([0]);

  const load = async () => {
    setRefreshing(true);
    try {
      const d = await getDocument();
      let r: any = [];
      d?.forEach((e: any) => {
        if (e._data.category !== "#income") r.push(e);
      });
      setChartDataByMonth(spendingByMonth(r));
      let result = spendingByYear(r);

      if (result.years.length === 0) {
        setChartDataByYear([
          { year: [new Date().getFullYear().toString()], data: [0] },
        ]);
      } else {
        setChartDataByYear(result);
      }

      setResp(r);
    } catch {
      setToggleSnack(true);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [reloadState]);

  return (
    // Wrapping the content inside SafeAreaView and ScrollView for safe handling of views
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: "100%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
      >
        {/* Header */}
        <View className="pt-1 flex justify-center items-start">
          <View className="flex justify-between flex-row items-center w-full">
            {/* Back button */}
            <TouchableOpacity
              className="py-2 px-2"
              onPress={() => props.navigation.goBack()}
            >
              <Ionicons
                name="chevron-back-sharp"
                size={26}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
            {/* Notification icon */}
            <TouchableOpacity
              className="py-2 px-4"
              onPress={() => props.navigation.navigate("Notifications")}
            >
              <Feather
                name="bell"
                size={24}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          </View>
          {/* Title */}
          <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-1">
            Spending
          </Text>
          {/* Line Graph */}
          <LineGraph
            _labels={
              labelI === 0
                ? [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].slice(
                    0,
                    chartDataByMonth.length === 0 ? 1 : chartDataByMonth.length
                  )
                : chartDataByYear.years || [new Date().getFullYear().toString()]
            }
            _data={
              labelI === 0 ? chartDataByMonth : chartDataByYear.data || [0]
            }
          />
          {/* Categories */}
          <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-4">
            Categories
          </Text>
          {/* Pie Graph */}
          <PieGraph transactions={resp} />
          {/* Monthly/Yearly Button */}
          <View className="flex justify-center items-center flex-row space-x-2 pb-3 w-full">
            {["Monthly", "Yearly"].map((e, i) => {
              return (
                <TouchableOpacity
                  className="py-1 px-3 text-sm rounded-full"
                  onPress={() => setLabelI(i)}
                  style={{
                    borderWidth: 2,
                    backgroundColor:
                      labelI === i
                        ? Colors[colorScheme ?? "light"].tint
                        : "transparent",
                    borderColor: Colors[colorScheme ?? "light"].tint,
                  }}
                  key={i}
                >
                  <Text
                    style={{
                      color:
                        labelI === i
                          ? "white"
                          : Colors[colorScheme ?? "light"].text,
                    }}
                  >
                    {e}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* Transactions */}
        <View className="pt-2">
          <Text className="text-xl font-semibold tracking-wider pl-2">
            Transactions
          </Text>
          <View>
            {resp?.length === 0 && (
              <Text className="w-full text-center pb-2 mt-2">
                No Transactions
              </Text>
            )}
            <View className="px-2 pt-2 pb-7">
              {/* Mapping transactions */}
              {resp
                ?.sort(
                  (a: any, b: any) =>
                    b._data.createdAt.seconds - a._data.createdAt.seconds
                )
                .map((e: any, i: number, a: any) => (
                  <Single
                    plan={e._data.plan}
                    key={i}
                    id={e.id}
                    description={e._data.description}
                    date={formattedDate(e._data.createdAt)}
                    amount={e._data.amount}
                    isIncome={e._data.category === "#income"}
                    isLast={a.length - 1 === i}
                    navigation={props.navigation}
                    category={e._data.category}
                  />
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={toggleSnack}
        onDismiss={() => setToggleSnack(false)}
        action={{
          label: "Reload",
          onPress: () => dispatch(reload()),
        }}
      >
        Please reload and try again
      </Snackbar>
    </SafeAreaView>
  );
}
