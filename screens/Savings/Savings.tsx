import {
  RefreshControl,
  SafeAreaView,
  TextInput,
  useColorScheme,
  Image,
  Dimensions,
  Text,
  View,
} from "react-native";
import WaveChart from "../../components/WaveChart";
import Colors from "../../constants/Colors";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";
import { useFirestore } from "../../firebase/useFirestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { triggerNotifications } from "../../utils/Notifications";
import calculateSavingsByMonth from "../../utils/Savings";
import { reload } from "../../store/slices/reloadSlice";
import RenderAmount from "../../components/RenderAmount";
import getCurrencySymbol from "../../utils/CurrencySymbols";

const height = Dimensions.get("window").height;

export default function Savings(props: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  // from redux
  const code = useSelector((state: RootState) => state.currency.code);
  const user = useSelector((state: RootState) => state.user);
  const reloadState = useSelector((state: RootState) => state.reload);
  const { currentBalance } = useSelector((state: RootState) => state.balances);

  // state variables
  const [loading, setLoading] = useState<boolean>();
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });
  const [targetAmount, setTargetAmount] = useState<string>("0");
  const [saveAmount, setSaveAmount] = useState<string>("0");
  //
  const [allSavings, setAllSavings] = useState<Array<any>>([]);
  const [currentMonthSavings, setCurrentMonthSavings] = useState<{
    currentAmount: number;
    totalSavings: number;
    targetAmount: number;
    month: string;
  }>({ targetAmount: 0, currentAmount: 0, month: "", totalSavings: 0 });
  //
  const [isCurrentMonthData, setIsCurrentMonthData] = useState<boolean>(false);

  //
  const { addDocument, getDocument } = useFirestore("savings", user.uid!);

  const { updateDocument: updateLeadersBoard, getDocument: getLeaderBoard } =
    useFirestore("leadersboard", user.uid!);

  const [leadersBoardSaving, setLeadersBoardSaving] = useState<{
    saving: number;
    id: string;
  }>();

  const onSubmit = async () => {
    try {
      setLoading(true);

      if (isCurrentMonthData) {
        setOpenSnackbar({
          open: true,
          msg: "This month savings already exist.",
        });
      } else {
        if (+targetAmount > 0 && +saveAmount >= 0) {
          if (+targetAmount <= +currentBalance) {
            addDocument({
              currentAmount: saveAmount,
              targetAmount: targetAmount,
            }).then(() => {
              leadersBoardSaving?.id != undefined &&
                updateLeadersBoard(
                  { totalSavings: Number(leadersBoardSaving?.saving) + Number(saveAmount) },
                  leadersBoardSaving?.id
                );
              triggerNotifications(
                `Savings`,
                `${saveAmount} ${getCurrencySymbol(
                  code
                )} to ${targetAmount} ${getCurrencySymbol(code)}`
              );
              dispatch(reload());
            });
          } else {
            setOpenSnackbar({ open: true, msg: "Not enough balance." });
          }
        } else {
          setOpenSnackbar({ open: true, msg: "Invalid amount." });
        }
      }
    } catch {
      setOpenSnackbar({ open: true, msg: "Error please try again later." });
    }

    setLoading(false);
  };

  const load = () => {
    setLoading(true);
    getLeaderBoard().then((doc: any) => {
      doc?.docs[0].id != undefined &&
        setLeadersBoardSaving({
          id: doc?.docs[0].id,
          saving: doc.docs[0]._data.totalSavings,
        });
    });
    getDocument()
      .then((doc) => {
        doc?.docs !== undefined && setAllSavings(doc?.docs);
        doc?.docs !== undefined &&
          setIsCurrentMonthData(isDocumentAvailable(doc?.docs));
        setCurrentMonthSavings(calculateSavingsByMonth(doc?.docs));
      })
      .catch(() => {
        setOpenSnackbar({ open: true, msg: "Error please start app." });
      });
    setLoading(false);
  };

  // loading savings
  useEffect(() => load(), [reloadState]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fcfcfe",
      }}
    >
      <ScrollView
        style={{ height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={loading!} onRefresh={load} />
        }
      >
        <View className="flex-row flex mt-1 justify-start items-center">
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
          <Text
            style={{ fontSize: 20 }}
            className="flex-1 pl-3 font-bold tracking-wider text-start py-4"
          >
            Savings
          </Text>
        </View>

        {/*  */}
        <View className="w-full pb-8 space-y-1 flex flex-col justify-center items-center">
          <Image
            className="rounded-full"
            style={{
              width: 120,
              height: 120,
              resizeMode: "stretch",
            }}
            source={require("../../assets/money_bag.gif")}
          />
          <Text className="px-4 font-bold text-3xl w-full text-center tracking-widest">
            <RenderAmount amount={currentMonthSavings.totalSavings || 0} />
          </Text>
          <Text
            style={{ color: "#767676" }}
            className="dark:text-white text-center w-full text-xl font-semibold"
          >
            Total savings
          </Text>
        </View>
        {/*  */}

        <View className="px-3 mt-3 space-y-2">
          <Text className="dark:text-white text-lg font-semibold">
            Target Amount
          </Text>
          <TextInput
            className="py-2 px-3 dark:text-white rounded-lg"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
            value={targetAmount === "0" ? "" : `${targetAmount}`}
            onChangeText={(text) => {
              setTargetAmount(text);
            }}
          />
          <Text className="dark:text-white text-lg font-semibold">Save</Text>
          <TextInput
            className="py-2 px-3 dark:text-white rounded-lg"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
            value={saveAmount >= "0" ? `${saveAmount}` : ""}
            onChangeText={(text) => {
              setSaveAmount(text);
            }}
          />
          <TouchableOpacity
            disabled={loading}
            onPress={() => onSubmit()}
            className="flex justify-center items-center rounded-lg mt-5"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          >
            <Text className="text-white py-3">
              {loading ? "Loading..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
        {allSavings?.length !== 0 ? (
          <>
            <View className="flex pl-3 flex-row justify-between items-center mt-4">
              <View>
                <Text className="text-xl font-bold tracking-wider">
                  This month
                </Text>
                {currentMonthSavings.month && (
                  <Text className="text-base tracking-wider">
                    ( {currentMonthSavings.month} )
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("AllTimeSavings")}
                className="flex flex-row justify-between items-center py-2 px-3"
              >
                <Text className="text-base text-red-600 font-semibold tracking-wider">
                  All
                </Text>
                <Entypo
                  name="chevron-small-right"
                  size={24}
                  color="rgb(220, 38, 38)"
                />
              </TouchableOpacity>
            </View>
            <View style={{ height: 800 }}>
              <WaveChart
                level={
                  (currentMonthSavings.currentAmount /
                    currentMonthSavings.targetAmount) *
                  100
                }
              />
            </View>
          </>
        ) : (
          <Text className="w-full text-center pb-2 mt-8">No savings</Text>
        )}
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

function isDocumentAvailable(documents: any[]): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  for (const doc of documents) {
    const docDate = new Date(
      doc._data.createdAt.seconds * 1000 +
        doc._data.createdAt.nanoseconds / 1000000
    );
    const docYear = docDate.getFullYear();
    const docMonth = docDate.getMonth();

    if (docYear === currentYear && docMonth === currentMonth) {
      return true;
    }
  }

  return false;
}
