import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import { View, Text } from "../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Convert } from "easy-currencies";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useFirestore } from "../firebase/useFirestore";
import { reload } from "../store/slices/reloadSlice";
import { triggerNotifications } from "../utils/Notifications";
import { setCurrency } from "../store/slices/currencySlice";

const height = Dimensions.get("window").height;

export default function Currency(props: any) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);

  //
  const [currenciesCodes, setCurrenciesCodes] = useState<Array<string> | null>(
    null
  );
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [id, setId] = useState<string>();

  //
  const { updateDocument, getDocument, addDocument } = useFirestore(
    "currency",
    user.uid!
  );

  const load = async () => {
    setRefresh(true);
    try {
      const convert = await Convert().from("GBP").fetch();
      setCurrenciesCodes(Object.keys(convert.rates));

      getDocument().then((doc) => {
        setSelectedCode(doc?.docs[0]?.data().code);
        setId(doc?.docs[0].id);
      });
    } catch {
      await addDocument({ code: "GBP" });
    }

    setRefresh(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Filtered currency codes based on search text
  const filteredCurrencyCodes = currenciesCodes?.filter((code) =>
    code.startsWith(searchText.toUpperCase())
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      id !== undefined &&
        updateDocument({ code: selectedCode }, id).then(() => {
          triggerNotifications(
            "Currency",
            `Currency is changed to '${selectedCode}'`
          );
          dispatch(setCurrency({ code: selectedCode }));
          dispatch(reload());
          setLoading(false);
          props.navigation.goBack();
        });
    } catch (error: any) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
      className="flex-1"
    >
      <ScrollView
        style={{ height: "90%" }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={load} />
        }
      >
        <View className="flex-row flex pt-7 justify-start items-center">
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
            Currency
          </Text>
        </View>
        <View className="px-2 py-3">
          <TextInput
            className="py-2 px-3 dark:text-white rounded-lg"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="Search..."
            placeholderTextColor="grey"
            keyboardType="default"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
        <View>
          {filteredCurrencyCodes?.length === 0 && (
            <Text className="text-lg font-semibold tracking-wider w-full text-center pl-2">
              Unavailable
            </Text>
          )}
          <View className="px-3">
            {filteredCurrencyCodes?.map((code: string) => (
              <Pressable
                onPress={() => setSelectedCode(code)}
                key={code}
                style={{
                  backgroundColor:
                    selectedCode === code
                      ? Colors[colorScheme ?? "light"].secondaryBackground
                      : "transparent",
                }}
                className="py-2 my-1 flex justify-between flex-row item-center"
              >
                <Text
                  style={{
                    color:
                      selectedCode === code
                        ? Colors[colorScheme ?? "light"].text
                        : "#767676",
                  }}
                  className="text-base font-semibold tracking-wider"
                >
                  {code}
                </Text>
                <MaterialIcons
                  name="radio-button-on"
                  size={22}
                  color={
                    selectedCode === code
                      ? Colors[colorScheme ?? "light"].tint
                      : "#767676"
                  }
                />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="px-3 pt-2 pb-7">
        <TouchableOpacity
          onPress={() => handleSubmit()}
          className="flex justify-center items-center flex-row py-4 rounded-full pt-3"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
        >
          <Text style={{ color: "white" }} className="text-sm tracking-wide ">
            {loading ? "Loading..." : "Select"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
