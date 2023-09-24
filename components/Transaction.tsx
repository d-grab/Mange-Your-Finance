import Colors from "../constants/Colors";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import formattedDate from "../utils/FormatDate";
import getCurrencySymbol from "../utils/CurrencySymbols";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import RenderAmount from "./RenderAmount";

const Transaction = (props: any) => {
  return (
    <View className="px-3 pt-1 pb-9 space-y-2">
      <Text className="text-lg font-bold dark:text-white">Transactions</Text>
      <View>
        {props.resp?.length === 0 && (
          <View>
            <Text className="w-full text-center pb-2 mt-2">
              No Transactions
            </Text>
          </View>
        )}
        {props?.resp
          ?.sort(
            (a: any, b: any) =>
              b._data.createdAt.seconds - a._data.createdAt.seconds
          )
          .map((e: any, i: number, a: any) => (
            <Single
              id={e.id}
              key={i}
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
      </View>
    </View>
  );
};

export const Single = ({
  description,
  date,
  amount,
  isLast,
  isIncome,
  navigation,
  category,
  id,
  plan,
}: {
  plan: string;
  id: string;
  category: string;
  description: string;
  date: string;
  amount: string;
  isLast: boolean;
  isIncome: boolean;
  navigation: any;
}) => {
  const colorScheme = useColorScheme();
  const code = useSelector((state: RootState) => state.currency.code);

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditTransaction", {
            description,
            date,
            amount,
            id,
            plan: plan,
            category: category,
          })
        }
        className="space-x-3 py-2 flex justify-between items-center flex-row"
      >
        <MaterialIcons
          name="compare-arrows"
          size={28}
          color={Colors[colorScheme ?? "light"].text}
        />
        <View className="flex-1 flex-col justify-center items-start">
          <Text
            className="text-xs"
            style={{ color: Colors[colorScheme ?? "light"].tint }}
          >
            {category}
          </Text>
          <Text
            className="text-lg font-semibold tracking-wider"
            style={{ color: Colors[colorScheme ?? "light"].text }}
          >
            {description}
          </Text>

          <Text className="text-xs" style={{ color: "gray" }}>
            {date}
          </Text>
        </View>
        <Text
          className={`${
            isIncome ? "text-green-900" : "text-red-700"
          } text-end font-semibold tracking-widest overflow-hidden`}
        >
          {isIncome ? "+  " : "-  "}
          <RenderAmount amount={+amount || 0} />
        </Text>

        <Entypo
          name="chevron-right"
          size={25}
          color={Colors[colorScheme ?? "light"].text}
        />
      </TouchableOpacity>
      {!isLast && (
        <View
          style={{ height: 1, backgroundColor: "gray" }}
          className="w-full"
        ></View>
      )}
    </View>
  );
};

export default Transaction;
