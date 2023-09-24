import {
  ImageBackground,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  useColorScheme,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { FadeInView } from "./animations";
import { useEffect, useRef, useState } from "react";
import Colors from "../constants/Colors";
import { useFirestore } from "../firebase/useFirestore";
import { Auth } from "../firebase/init";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../store/slices/snackSlice";
import { reload } from "../store/slices/reloadSlice";
import { triggerNotifications } from "../utils/Notifications";
import { OnlyNumbers } from "../constants/Validations";
import getCurrencySymbol from "../utils/CurrencySymbols";
import RenderAmount from "./RenderAmount";

const image = require("../assets/images/banner.png");

const Hero = ({ currentBalance, navigation }: any) => {
  const [incomeOrSpend, setIncomeOrSpend] = useState<number | null>(null);
  const code = useSelector((state: RootState) => state.currency.code);

  return (
    <>
      <View
        style={{ width: "100%", height: Dimensions.get("window").height / 2.8 }}
      >
        <ImageBackground
          source={image}
          resizeMode="cover"
          className="flex-1 justify-between items-start flex-col px-3 pb-3"
        >
          <View className="flex justify-end items-end w-full">
            <TouchableOpacity
              className="py-4 px-4"
              onPress={() => navigation.navigate("Notifications")}
            >
              <Feather name="bell" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex justify-center items-center w-full space-y-2">
              <Text className="text-white text-xl">My Balance</Text>
              <FlatList
                data={[currentBalance || 0]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={(item) => (
                  <View>
                    <Text className="text-white text-3xl font-bold">
                      <RenderAmount amount={item.item} />
                    </Text>
                  </View>
                )}
                keyExtractor={() => `1`}
              />
            </View>
          </View>

          <View className="flex justify-between items-center mt-3 mb-1 flex-row w-full">
            <TouchableOpacity
              className="px-10 py-3 rounded-xl"
              style={styles.button}
              onPress={() =>
                setIncomeOrSpend((prev) => (prev === 0 ? null : 0))
              }
            >
              <Text className="text-white">Add Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-10 py-3 rounded-xl"
              style={styles.button}
              onPress={() =>
                setIncomeOrSpend((prev) => (prev === 1 ? null : 1))
              }
            >
              <Text className="text-white">Add Spending</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {incomeOrSpend === 0 ? (
        <AddIncome setIncomeOrSpend={setIncomeOrSpend} />
      ) : incomeOrSpend === 1 ? (
        <AddSpending
          currentBalance={currentBalance}
          setIncomeOrSpend={setIncomeOrSpend}
        />
      ) : null}
    </>
  );
};

const AddIncome = ({
  setIncomeOrSpend,
}: {
  setIncomeOrSpend: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const code = useSelector((state: RootState) => state.currency.code);
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("-1");
  const [description, setDescription] = useState<string>("");
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const { addDocument } = useFirestore("transactions", Auth.currentUser?.uid!);

  const Submit = async () => {
    if (amount != undefined && +amount >= 1 && description.length >= 1) {
      setLoading(true);
      addDocument({
        amount: amount,
        description: description,
        category: "#income",
        plan: "Deposit",
      }).then(() => {
        "transaction added";
        setLoading(false);
        setIncomeOrSpend(null);
        triggerNotifications(
          "Deposit",
          `${amount} ${getCurrencySymbol(code)} is Deposit`
        );
        dispatch(reload());
      });
      return;
    } else {
    }
    setIsEmpty(true);
  };

  return (
    <FadeInView _duration={100}>
      <View className="px-3 space-y-3 py-4">
        <View className="flex justify-between flex-row items-center">
          <Text className="dark:text-white text-xl font-bold">Add Income</Text>
          <TouchableOpacity
            className="pl-1 py-1"
            onPress={() => setIncomeOrSpend(null)}
          >
            <Ionicons
              name="close-sharp"
              size={28}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">
            Income Source
          </Text>
          <TextInput
            onChangeText={(text) => setDescription(text)}
            className="py-2 px-3 dark:text-white rounded-lg"
            value={description}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholderTextColor="grey"
            placeholder="e.g Salary"
            keyboardType="default"
          />
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">Amount</Text>
          <TextInput
            onChangeText={(text) => {
              setAmount(text);
            }}
            className="py-2 px-3 dark:text-white rounded-lg"
            value={+amount < 0 ? "" : `${amount}`}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
          />
        </View>
        <Text
          className="text-base text-red-500 font-bold"
          style={{ opacity: isEmpty ? 1 : 0 }}
        >
          Fields are empty
        </Text>
        <TouchableOpacity
          disabled={loading}
          onPress={() => Submit()}
          className="flex justify-center items-center rounded-lg"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
        >
          <Text className="text-white py-3">Deposit</Text>
        </TouchableOpacity>

        {/* divider */}
        <View
          style={{ height: 1, backgroundColor: "gray" }}
          className="w-full"
        ></View>
      </View>
    </FadeInView>
  );
};

const AddSpending = ({
  setIncomeOrSpend,
  currentBalance,
}: {
  currentBalance: number;
  setIncomeOrSpend: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const code = useSelector((state: RootState) => state.currency.code);

  const refC = useRef<TextInput>(null); // ref for categories
  const refP = useRef<TextInput>(null); // ref for categories

  const [loading, setLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [whichOne, setWhichOne] = useState<number>(0); // 1 for category and 2 for plan
  const [maxAmountPlan, setMaxAmountPlan] = useState<number>(0);

  const [payload, setPayload] = useState<{
    description: string;
    amount: string;
    category?: string;
    plan?: string;
    code?: string;
    id?: string;
    currentAmount?: string;
  }>({
    id: "",
    description: "",
    amount: "",
    category: "",
    plan: "",
    code: "",
    currentAmount: "",
  });

  const [categories, setCategories] = useState<Array<any>>();
  const [plans, setPlans] = useState<Array<any>>();

  const { getDocument: getCategories } = useFirestore("categories", user.uid!);
  const { getDocument: getPlans, updateDocument } = useFirestore(
    "plans",
    user.uid!
  );
  const { addDocument } = useFirestore("transactions", Auth.currentUser?.uid!);

  // loading categories and plans
  const load = async () => {
    try {
      setLoading(true);
      getCategories().then((doc) => setCategories(doc?.docs));
      getPlans().then((doc) => setPlans(doc?.docs));
      setLoading(false);
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  // on submit
  const Submit = async () => {
    try {
      if (OnlyNumbers(payload?.amount)) {
        if (
          +payload?.amount >= 1 &&
          payload.description.length >= 1 &&
          (payload.category?.length! >= 1 || payload?.plan?.length! >= 1)
        ) {
          if (+payload.amount <= currentBalance) {
            setLoading(true);
            addDocument({
              amount: +payload?.amount!,
              description: payload?.description,
              category:
                payload?.category !== undefined ? `${payload?.category}` : "",
              plan:
                payload?.plan !== undefined && payload?.plan?.trim() !== ""
                  ? `${payload?.plan}`
                  : "no-plan",
            }).then(async () => {
              if (payload?.plan !== undefined && payload?.plan?.trim() !== "")
                await updateDocument(
                  {
                    currentAmount: +payload?.currentAmount! + +payload?.amount!,
                  },
                  payload?.id!
                ).then(() => {
                  // setIncomeOrSpend(null);
                });
              setIncomeOrSpend(null);
              setLoading(false);
              triggerNotifications(
                "Credit",
                `${payload?.amount} ${getCurrencySymbol(code)} is Credit`
              );
              dispatch(reload());
            });
            return;
          } else {
            dispatch(set({ toggle: true, msg: "Limit exceed." }));
          }
        }
      } else {
        dispatch(set({ toggle: true, msg: "Invalid amount." }));
      }

      setIsEmpty(true);
    } catch {}
  };

  return (
    <FadeInView _duration={100}>
      <View className="px-3 space-y-3 py-4">
        <View className="flex justify-between flex-row items-center">
          <Text className="dark:text-white text-xl font-bold">
            Add Spending
          </Text>
          <TouchableOpacity
            className="pl-1 py-1"
            onPress={() => setIncomeOrSpend(null)}
          >
            <Ionicons
              name="close-sharp"
              size={28}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">
            Description
          </Text>
          <TextInput
            onChangeText={(description) =>
              setPayload({ ...payload, description })
            }
            className="border-2 py-2 px-3 dark:text-white rounded-lg"
            value={payload?.description}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholderTextColor="grey"
            placeholder="e.g House Rent"
            keyboardType="default"
          />
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">
            Spend Amount{" "}
            <Text className="text-sm">
              (Limit:{" "}
              {payload.plan === undefined ? currentBalance : maxAmountPlan})
            </Text>
          </Text>
          <TextInput
            onChangeText={(amount) => {
              setPayload({ ...payload, amount });
            }}
            className="py-2 px-3 dark:text-white rounded-lg"
            value={payload?.amount}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
          />
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">
            Category
          </Text>
          <TextInput
            ref={refC}
            onBlur={() => setWhichOne(0)}
            onFocus={() => setWhichOne(1)}
            className="py-2 px-3 dark:text-white rounded-lg"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="Choose..."
            placeholderTextColor="grey"
            keyboardType="default"
            showSoftInputOnFocus={false}
            value={payload?.category}
            onChangeText={(category) => {
              setPayload({ ...payload, category });
            }}
          />
          {/* Selection */}
          <View
            className="py-2 space-y-1"
            style={{ display: whichOne === 1 ? "flex" : "none" }}
          >
            {categories?.length === 0 && (
              <Text
                className="text-base text-center font-semibold"
                style={{ color: Colors[colorScheme ?? "light"].text }}
              >
                No category.
              </Text>
            )}
            {categories?.map((e, i) => (
              <TouchableOpacity
                onPress={() => {
                  refC.current?.blur();
                  refP.current?.clear();
                  setWhichOne(0);
                  setPayload({
                    ...payload,
                    plan: undefined,
                    category: e._data.description,
                    code: e._data.code,
                  });
                }}
                key={i}
                style={{ borderWidth: 1, borderColor: "gray" }}
                className="rounded-lg px-2 py-2 flex flex-row justify-start items-center"
              >
                <Text className="text-base font-semibold tracking-wider">
                  {e._data.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View>
          <Text className="font-semibold text-base text-red-500">(OR)</Text>
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">Plan</Text>
          <TextInput
            ref={refP}
            onBlur={() => setWhichOne(0)}
            onFocus={() => setWhichOne(2)}
            className="py-2 px-3 dark:text-white rounded-lg"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="Choose..."
            placeholderTextColor="grey"
            keyboardType="default"
            showSoftInputOnFocus={false}
            value={payload?.plan}
            onChangeText={(plan) => {
              setPayload({ ...payload, plan });
            }}
          />
          {/* Selection */}
          <View
            className="py-2 space-y-1"
            style={{ display: whichOne === 2 ? "flex" : "none" }}
          >
            {plans?.length === 0 && (
              <Text
                className="text-base text-center font-semibold"
                style={{ color: Colors[colorScheme ?? "light"].text }}
              >
                No plan.
              </Text>
            )}
            {plans?.map((e, i) => (
              <TouchableOpacity
                onPress={() => {
                  refP.current?.blur();
                  refC.current?.clear();
                  setWhichOne(0);
                  setMaxAmountPlan(
                    e._data.budgetAmount - e._data.currentAmount
                  );

                  setPayload({
                    ...payload,
                    plan: e._data.title,
                    category: e._data.code,
                    id: e.id,
                    currentAmount: e._data.currentAmount,
                  });
                }}
                key={i}
                style={{ borderWidth: 1, borderColor: "gray" }}
                className="rounded-lg px-2 py-2 flex flex-row justify-start items-center"
              >
                <Text className="text-base font-semibold tracking-wider">
                  {e._data.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text
          className="text-base text-red-500 font-bold"
          style={{ opacity: isEmpty ? 1 : 0 }}
        >
          Fields are empty
        </Text>
        <TouchableOpacity
          disabled={loading}
          onPress={() => Submit()}
          className="flex justify-center items-center rounded-lg"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
        >
          <Text className="text-white py-3">
            {loading ? "Loading..." : "Credit"}
          </Text>
        </TouchableOpacity>
        {/* divider */}
        <View
          style={{ height: 1, backgroundColor: "gray" }}
          className="w-full"
        ></View>
      </View>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
});

export default Hero;
