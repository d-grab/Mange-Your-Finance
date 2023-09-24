import {
  ScrollView,
  TextInput,
  useColorScheme,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import { TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useEffect, useState } from "react";
import { useFirestore } from "../../firebase/useFirestore";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "react-native-paper";
import { reload } from "../../store/slices/reloadSlice";
import { triggerNotifications } from "../../utils/Notifications";
import RenderAmount from "../../components/RenderAmount";
import getCurrencySymbol from "../../utils/CurrencySymbols";

const height = Dimensions.get("window").height;

export default function EditSavings(props: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { currentBalance } = useSelector((state: RootState) => state.balances);
  const code = useSelector((state: RootState) => state.currency.code);

  const [leadersBoardSaving, setLeadersBoardSaving] = useState<{
    saving: number;
    id: string;
  }>();

  //
  const params = props.route.params;

  // state
  const [toggleDelete, setToggleDelete] = useState<boolean>(false);
  const [saveAmount, setSaveAmount] = useState<string>(params.currentAmount);
  const [targetAmount, setTargetAmount] = useState<string>(params.amount);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });

  // importing hooks
  const { updateDocument, deleteDocument } = useFirestore("savings", user.uid!);

  const { updateDocument: updateLeadersBoard, getDocument: getLeaderBoard } =
    useFirestore("leadersboard", user.uid!);

  // update
  const onUpdate = async () => {
    try {
      setLoading(true);
      if (+saveAmount >= 0 && +targetAmount > 0) {
        if (+saveAmount <= +targetAmount ) {
          await updateDocument(
            {
              currentAmount: saveAmount || 0,
              targetAmount: targetAmount || 0,
            },
            params.id
          ).then(() => {
            leadersBoardSaving?.id != undefined &&
              updateLeadersBoard(
                {
                  totalSavings:
                    Number(leadersBoardSaving?.saving) < Number(saveAmount)
                      ? Number(leadersBoardSaving?.saving) +
                        (Number(saveAmount) -
                          Number(leadersBoardSaving?.saving))
                      : Number(leadersBoardSaving?.saving) -
                        (Number(leadersBoardSaving?.saving) -
                          Number(saveAmount)),
                },
                leadersBoardSaving?.id
              );
            props.navigation.goBack();
            triggerNotifications(
              `Savings`,
              `Now ${saveAmount || 0} ${getCurrencySymbol(
                code
              )} to ${targetAmount} ${getCurrencySymbol(code)} savings.`
            );
            dispatch(reload());
          });
        } else {
          setOpenSnackbar({ open: true, msg: "Not enough balance." });
        }
      } else {
        setOpenSnackbar({ open: true, msg: "Invalid amount." });
      }
    } catch {
      setOpenSnackbar({ open: true, msg: "Error please try again later." });
    }
    setLoading(false);
  };

  useEffect(() => {
    getLeaderBoard().then((doc: any) => {
      doc?.docs[0].id != undefined &&
        setLeadersBoardSaving({
          id: doc?.docs[0].id,
          saving: doc.docs[0]._data.totalSavings,
        });
    });
  }, []);

  // delete
  const onDelete = async () => {
    setLoading(true);
    try {
      await deleteDocument(params.id).then(() => {
        triggerNotifications(
          `Savings`,
          `Removed ${saveAmount} ${getCurrencySymbol(code)} from `
        );
        props.navigation.goBack();
        dispatch(reload());
      });
    } catch {
      setOpenSnackbar({ open: true, msg: "Error please try again later." });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: "100%",
        }}
      >
        <View className="flex flex-row justify-between items-center">
          <View className="flex-row flex mt-2 justify-start items-center">
            <TouchableOpacity
              className="py-3 px-3"
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
              className="pl-3 font-bold tracking-wider text-start py-4"
            >
              Update saving
            </Text>
          </View>
          <TouchableOpacity
            disabled={loading}
            onPress={() => setToggleDelete(!toggleDelete)}
            className="px-3 py-2"
          >
            <MaterialCommunityIcons
              name="delete-empty"
              size={27}
              color={"rgb(185 28 28)"}
            />
          </TouchableOpacity>
        </View>

        <View className="w-full mt-6">
          <Text className="w-full text-center text-2xl font-bold tracking-widest">
            {params.month}
          </Text>
          <Text
            style={{ color: "#767676" }}
            className="w-full text-center font-semibold tracking-wider"
          >
            <RenderAmount amount={params.amount} />
          </Text>
          <Text
            style={{ color: "#767676" }}
            className="w-full text-center font-semibold tracking-wider"
          >
            <RenderAmount amount={params.currentAmount} />
          </Text>
        </View>

        <View className="px-3 mt-10">
          <Text className="dark:text-white text-lg font-semibold">
            Goal Amount
          </Text>
          <TextInput
            className="py-2 mb-2 px-3 dark:text-white rounded-lg mt-1"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
            value={`${targetAmount}`}
            onChangeText={(text) => {
              setTargetAmount(text);
            }}
          />
          <Text className="dark:text-white text-lg font-semibold">
            Save Amount
          </Text>
          <TextInput
            className="py-2 px-3 dark:text-white rounded-lg mt-1"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
            value={`${saveAmount}`}
            onChangeText={(text) => {
              setSaveAmount(text);
            }}
          />
          <TouchableOpacity
            disabled={loading}
            onPress={() => onUpdate()}
            className="flex justify-center items-center rounded-lg mt-5"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          >
            <Text className="text-white py-3">
              {loading ? "Loading..." : "Update"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={openSnackbar.open}
        onDismiss={() => setOpenSnackbar({ ...openSnackbar, open: false })}
      >
        {openSnackbar.msg}
      </Snackbar>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={toggleDelete}
        onDismiss={() => setToggleDelete(false)}
        action={{
          label: "Yes",
          onPress: async () => onDelete(),
        }}
      >
        Are you sure?
      </Snackbar>
    </SafeAreaView>
  );
}
