import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { triggerNotifications } from "../../utils/Notifications";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import { TextInput, StyleSheet } from "react-native";
import { isValidOrFutureDate } from "../../utils/FormatDate";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const height = Dimensions.get("window").height;
export default function Notifications(props: any) {
  const colorScheme = useColorScheme();
  const code = useSelector((state: RootState) => state.currency.code);

  //
  const [date, setDate] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [dailySaving, setDailySaving] = useState<string>("");
  const [isValidAmount, setIsValidAmount] = useState<boolean | null>(null);
  const [isValidDate, setIsValidDate] = useState<boolean | null>(null);
  const [isValidSaving, setIsValidSaving] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ daily: string }>({
    daily: "",
  });
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    greenText: {
      color: 'green',
    },
    boldText: {
      fontWeight: 'bold',
    },
  });

  const onSubmit = async () => {
    setLoading(true);

    try {
      // if (+dailySaving <= 1) {
      //   setIsValidSaving(false);
      //   return;
      // }
      // setIsValidSaving(true);

      if (!dailySaving || +dailySaving <= 0) {
        if (+amount < 1) {
          setIsValidAmount(false);
          return;
        }
        setIsValidAmount(true);

        if (!isValidOrFutureDate(date)) {
          setIsValidDate(false);
          return;
        }
        setIsValidDate(true);
        let daily = suggestDailySavings(+amount, date, code);
        setResult({
          daily: `By saving ${daily} each day\n You can achieve Your goal of saving: ${amount}£
  On : ${date}`,
        });
        triggerNotifications("Strategies", daily);
      } else {
        if (+dailySaving <= 1) {
          setIsValidSaving(false);
          return;
        }
        setIsValidSaving(true);

        if (!isValidOrFutureDate(date)) {
          setIsValidDate(false);
          return;
        }

        setIsValidDate(true);
        let daily = GiveDailySaving(+dailySaving, date, code);
        setResult({
          daily: `By saving ${dailySaving} GBP each day, \n You can save ${daily} \n Until: ${date}.`,
        });
        triggerNotifications("Strategies", daily);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-1 justify-start items-center pb-7">
          <View className="w-full flex flex-row justify-start items-center pt-2">
            <TouchableOpacity
              className="py-1 px-3"
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
              className="flex-1 pl-3 font-bold tracking-wider text-start py-1"
            >
              Saving Strategies
            </Text>
          </View>
          <View className="w-full flex flex-col justify-center items-start px-3 pt-8">
            {/* Amount */}
            <Text
              className="tracking-wider mb-2 text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              Total Amount to save
            </Text>
            <TextInput
              className="py-2 px-3 w-full mb-2 dark:text-white rounded-lg"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="Amount"
              placeholderTextColor="grey"
              keyboardType="numeric"
              value={+amount < 0 ? "" : amount}
              onChangeText={(text) => {
                setAmount(text);
              }}
            />
            <Text className="text-base text-red-500 font-bold">
              {dailySaving.trim().length > 0 &&
                amount.trim().length > 0 &&
                "Please choose only one field."}
              {isValidAmount === false && "Invalid amount"}
            </Text>
            {/* salary */}
            
            <Text
              className="tracking-wider mb-2 mt-2 text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              Daily Amount to save
            </Text>
            <TextInput
              className="py-2 px-3 w-full mb-2 dark:text-white rounded-lg"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="Amount"
              placeholderTextColor="grey"
              keyboardType="numeric"
              value={dailySaving}
              onChangeText={(text) => {
                setDailySaving(text);
              }}
            />
            <Text
              className="text-base text-red-500 font-bold"
              style={{ opacity: isValidSaving === false ? 1 : 0 }}
            >
              Invalid amount
            </Text>
            {/* date */}
            <Text
              className="tracking-wider mb-2 mt-3 text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              Select a date:
            </Text>
            <Calendar
              style={{
                width: Dimensions.get("window").width / 1.05,
                backgroundColor: Colors[colorScheme ?? "light"].background,
              }}
              onDayPress={(day) => {
                setDate(day.dateString);
              }}
              markedDates={{
                [date]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: Colors[colorScheme ?? "light"].tint,
                },
              }}
            />
            <Text
              className="text-base text-red-500 font-bold"
              style={{ opacity: isValidDate === false ? 1 : 0 }}
            >
              Invalid Date
            </Text>
          </View>
          <View className="w-full p-3">
            <Text
              className="tracking-wider mb-1 mt-1 text-base text-center font-semibold"
              style={{ color: "#767676", opacity: result.daily ? 1 : 0 }}
            >
              {result.daily}
            </Text>
            <TouchableOpacity
              disabled={loading}
              onPress={() => onSubmit()}
              className="flex justify-center items-center mt-5 w-full flex-row py-4 rounded-full"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text
                style={{ color: "white" }}
                className="text-sm tracking-wide "
              >
                {loading ? "Calculating..." : "Calculate"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function suggestDailySavings(
  targetAmount: number,
  targetDate: string,
  code: string
): string {
  const currentDate = new Date();
  const endDate = new Date(targetDate);

  if (endDate <= currentDate) {
    throw new Error("Target date should be in the future.");
  }

  const daysRemaining = Math.ceil(
    (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );

  if (daysRemaining <= 0) {
    throw new Error("Target date should be in the future.");
  }

  const dailySavings = targetAmount / daysRemaining;
  return `${(dailySavings || 0).toFixed(2)} ${code}`;
}

function GiveDailySaving(
  targetAmount: number,
  targetDate: string,
  code: string
) {
  const currentDate = new Date();
  const endDate = new Date(targetDate);

  if (endDate <= currentDate) {
    throw new Error("Target date should be in the future.");
  }

  const daysRemaining = Math.ceil(
    (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );

  if (daysRemaining <= 0) {
    throw new Error("Target date should be in the future.");
  }

  const dailySavings = targetAmount * daysRemaining;
  return `${(dailySavings || 0).toFixed(2)} ${code}`;
}

// function suggestSavingsPercentage(
//   date: string,
//   amount: number,
//   monthlyIncome: number
// ): string {
//   const targetDate = new Date(date);
//   const currentDate = new Date();

//   const monthsRemaining =
//     (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
//     targetDate.getMonth() -
//     currentDate.getMonth();
//   const savingsRequired = amount - monthlyIncome * monthsRemaining;

//   if (savingsRequired <= 0) {
//     return "You've already saved enough for this goal!";
//   }

//   let savingsPercentage =
//     (savingsRequired / (monthlyIncome * monthsRemaining)) * 100;

//   if (savingsPercentage <= 5) {
//     return "You should aim to save at least 5% of your income.";
//   } else if (savingsPercentage <= 10) {
//     return "You should aim to save at least 10% of your income.";
//   } else if (savingsPercentage <= 15) {
//     return "You should aim to save at least 15% of your income.";
//   } else if (savingsPercentage <= 20) {
//     return "You should aim to save at least 20% of your income.";
//   } else if (savingsPercentage <= 25) {
//     return "You should aim to save at least 25% of your income.";
//   } else if (savingsPercentage <= 30) {
//     return "You should aim to save at least 30% of your income.";
//   } else {
//     return "You should aim to save at least 40% of your income or more.";
//   }
// }
