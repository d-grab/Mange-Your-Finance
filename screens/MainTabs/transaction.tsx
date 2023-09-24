import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Single } from "../../components/Transaction";
import { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { PieGraph } from "../../components/PieGraph";
import { LineGraph } from "../../components/LineGraph";
import { useFirestore } from "../../firebase/useFirestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import formattedDate from "../../utils/FormatDate";
import { reload } from "../../store/slices/reloadSlice";
import { Snackbar } from "react-native-paper";
import { spendingByMonth, spendingByYear } from "../../utils/GenChart";

export default function Transaction(props: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const reloadState = useSelector((state: RootState) => state.reload);

  // Using the useState hook to manage a state variable "labelI" with an initial value of 0
  const [labelI, setLabelI] = useState<number>(0);
  // Getting the user data from the Redux store
  const user = useSelector((state: RootState) => state.user);

  const [resp, setResp] = useState<any[]>();
  const [refreshing, setRefreshing] = useState(false);
  const [toggleSnack, setToggleSnack] = useState<boolean>(false);
  const [chartDataByMonth, setChartDataByMonth] = useState<Array<number>>([0]);
  const [chartDataByYear, setChartDataByYear] = useState<any>([0]);

  const { getDocument } = useFirestore("transactions", user.uid!);

  const load = async () => {
    setRefreshing(true);
    try {
      getDocument().then((doc) => {
        setResp(doc?.docs);
        setChartDataByMonth(spendingByMonth(doc?.docs));
        let result = spendingByYear(doc?.docs);

        if (result.years.length === 0) {
          setChartDataByYear([
            { year: [new Date().getFullYear().toString()], data: [0] },
          ]);
        } else {
          setChartDataByYear(result);
        }
      });
    } catch {
      setToggleSnack(true);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    load();
  }, [reloadState]);

  useEffect(() => {
    setChartDataByMonth(spendingByMonth(resp));
  }, [labelI]);

  // JSX code starts here
  return (
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
        {/* Section for displaying the "Savings" data */}
        <View className="pt-2 flex justify-center items-center">
          <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-4">
            Spending
          </Text>
          {/* Rendering the LineGraph component with random data */}
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
        </View>

        {/* Section for displaying the "Spending" data */}
        <View className="pt-2 flex justify-center items-center">
          <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-4">
            Categories
          </Text>
          {/* Rendering the PieGraph component */}
          <PieGraph transactions={resp} />
        </View>

        {/* Section for displaying "Monthly" and "Yearly" buttons */}
        <View className="flex justify-center items-center flex-row space-x-2 pb-3">
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

        {/* Section for displaying the list of transactions */}
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
              {/* Rendering multiple instances of the "Single" component with sample data */}
              {resp
                ?.sort(
                  (a: any, b: any) =>
                    b._data.createdAt.seconds - a._data.createdAt.seconds
                )
                .map((e: any, i: number, a: any) => (
                  <Single
                    key={i}
                    id={e.id}
                    plan={e._data.plan}
                    description={e._data.description}
                    date={formattedDate(e._data.createdAt)}
                    amount={e._data.amount}
                    isIncome={e._data.category === "#income"}
                    isLast={a.length - 1 === i}
                    navigation={props.navigation}
                    category={e._data.category}
                  />
                ))}
              {/* Other instances of the "Single" component are also rendered here */}
              {/* ... */}
            </View>
          </View>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "3%" }}
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
