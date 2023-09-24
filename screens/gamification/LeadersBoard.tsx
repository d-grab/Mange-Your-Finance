import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase/init";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import RenderAmount from "../../components/RenderAmount";
import LinearGradient from "react-native-linear-gradient";

// @ts-ignore

const { height, width } = Dimensions.get("window");

export default function LeadersBoard(props: any) {
  const colorScheme = useColorScheme();
  const [allRanking, setAllRanking] = useState<Array<any>>();
  const [top3, setTop3] = useState<Array<any>>();
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setReady(false);
      const r = await db.collection("leadersboard").get();
      setAllRanking(sortByTotalSavings(r.docs));
      setTop3(sortByTotalSavingsAndTop3(r.docs));
      setReady(true);
    })();
  }, []);

  if (!ready) {
    <View />;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fcfcfe",
      }}
    >
      <ScrollView
        style={{
          backgroundColor: "#007700",
        }}
      >
        <LinearGradient
          colors={[
            "#007700",
            "#fff", // Darker teal green
            "#007700",
            "#007700" // Dark green
          ]}
          style={{ paddingBottom: 1 }}
        >
          <View className="flex-row w-full flex mt-1 justify-start items-center">
            <TouchableOpacity
              className="py-4 px-3"
              onPress={() => props.navigation.goBack()}
            >
              <Ionicons
                name="chevron-back-sharp"
                size={height > 630 ? 26 : 20}
                color={"white"}
              />
            </TouchableOpacity>
            <Text
              style={{ fontSize: 18 }}
              className="pl-3 font-bold tracking-wider text-start py-4 text-white"
            >
              Leaderboard
            </Text>
          </View>
          <View className="w-full flex justify-center items-center pt-10">
            {top3 != undefined && (
              <View className="flex justify-between items-center flex-row w-full px-7">
                <View
                  style={{ position: "relative", top: 40 }}
                  className="flex justify-start items-start"
                >
                  <Image
                    style={{ height: 60, width: 60 }}
                    resizeMode="cover"
                    className="rounded-full"
                    source={top3[1]._data.avatar}
                  />
                  <Text className="text-white font-semibold pt-1">
                    {top3[1]._data.displayName}
                  </Text>
                </View>
                <View className="flex justify-start items-start">
                  <Image
                    style={{ height: 60, width: 60 }}
                    resizeMode="cover"
                    className="rounded-full"
                    source={top3[0]._data.avatar}
                  />
                  <Text className="text-white font-semibold pt-1">
                    {top3[0]._data.displayName}
                  </Text>
                </View>
                <View
                  style={{ position: "relative", top: 60 }}
                  className="flex justify-start items-start"
                >
                  <Image
                    style={{ height: 60, width: 60 }}
                    resizeMode="cover"
                    className="rounded-full"
                    source={top3[2]._data.avatar}
                  />
                  <Text className="text-white font-semibold pl-4 pt-1 mb-2">
                    {top3[2]._data.displayName}
                  </Text>
                </View>
              </View>
            )}
            <Image
              style={{ height: 200, width: 300, marginBottom: -30, marginTop: -20}}
              source={require("../../assets/ranking.webp")}
              resizeMode="stretch"
            />
          </View>

          <View
            className="py-3 rounded-t-xl"
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
          >
            <ScrollView className="pb-96">
              <View className="px-2">
                {allRanking?.map((e, i) => {
                  return (
                    <Single
                      key={i}
                      name={e._data.displayName}
                      avatar={e._data.avatar}
                      savings={e._data.totalSavings}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const Single = ({
  name,
  avatar,
  savings,
}: {
  name: string;
  avatar: number;
  savings: number;
}) => {
  return (
    <View className="pb-3">
      <View className="flex flex-row justify-between items-center">
        <Image
          source={avatar}
          style={{ height: 45, width: 45 }}
          resizeMode="cover"
          className="rounded-full"
        />
        <Text
          className="tracking-widest text-base pl-3 text-start flex-1"
          style={{ fontWeight: "700" }}
        >
          {name}
        </Text>
        <Text
          className="tracking-wider text-base text-center font-semibold"
          style={{ color: "#767676" }}
        >
          Savings: <RenderAmount amount={savings} />
        </Text>
      </View>
    </View>
  );
};

function sortByTotalSavingsAndTop3(data: any) {
  // Sort the data array in descending order based on totalSavings
  const sortedData = data.sort(
    (a: any, b: any) => b._data.totalSavings - a._data.totalSavings
  );

  // Get the top 3 users with the highest totalSavings
  const top3Users = sortedData.slice(0, 3);

  return top3Users;
}

function sortByTotalSavings(data: any): any {
  // Sort the data array in descending order based on totalSavings
  const sortedData = data.sort(
    (a: any, b: any) => b._data.totalSavings - a._data.totalSavings
  );
  return sortedData;
}
