import { RefreshControl, ScrollView, useColorScheme, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useEffect, useState } from "react";
import { useFirestore } from "../../firebase/useFirestore";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Single } from "../../components/Savings";

const height = Dimensions.get("window").height;

export default function AllTimeSavings(props: any) {
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);
  const reloadState = useSelector((state: RootState) => state.reload);

  //
  const [refresh, setRefresh] = useState<boolean>(false);
  const [savings, setSavings] = useState<Array<any>>([]);

  const { getDocument: getSavings } = useFirestore("savings", user.uid!);

  const load = async () => {
    setRefresh(true);
    try {
      await getSavings().then(
        (doc) => doc?.docs !== undefined && setSavings(doc?.docs)
      );
    } catch {}
    setRefresh(false);
  };

  useEffect(() => {
    load();
  }, [reloadState]);

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={load} />
        }
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <View className="flex-row flex mt-2 justify-start items-center">
          <TouchableOpacity
            className="py-4 px-3"
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={height > 630 ? 26 : 20}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }} className="flex-1 pl-3 font-bold tracking-wider text-start py-4">
            Savings
          </Text>
        </View>
        <View className="px-2 my-5">
          {savings?.length === 0 && (
            <Text className="w-full text-center pb-2 mt-2">No savings</Text>
          )}

          {savings.map((e, i) => {
            return (
              <View key={i} className="mb-2">
                <Single
                  currentAmount={e._data.currentAmount}
                  navigation={props.navigation}
                  id={e.id}
                  month={timestampToMonthYear(e._data.createdAt)}
                  amount={e._data.targetAmount}
                  progress={
                    e._data.currentAmount !== 0 || e._data.targetAmount !== 0
                      ? e._data.currentAmount / e._data.targetAmount
                      : 0
                  }
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function timestampToMonthYear(timestamp: {
  nanoseconds: number;
  seconds: number;
}): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${monthName} ${year}`;
}
