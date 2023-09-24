import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { Text, View } from "../../components/Themed";
import { FadeInView } from "../../components/animations";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useFirestore } from "../../firebase/useFirestore";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../../store/slices/snackSlice";
import { Snackbar } from "react-native-paper";
import { reload } from "../../store/slices/reloadSlice";
import { triggerNotifications } from "../../utils/Notifications";

interface Payload {
  title: string;
  amount: string;
  category: string;
  code: string;
  id: string;
}

export default function EditPlan(props: any) {
  const ref = useRef<TextInput>(null);
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const { currentBalance } = useSelector((state: RootState) => state.balances);

  const { getDocument } = useFirestore("categories", user.uid!);
  const {
    addDocument,
    updateDocument,
    getDocument: getPlans,
    deleteDocument,
  } = useFirestore("plans", user.uid!);

  // Extract the title, amount, and category from local search parameters
  const { title, amount, category, id } = props.route.params;

  const [payload, setPayload] = useState<Payload>({
    title: `${title === 0 ? "" : title}`,
    amount,
    category,
    code: "",
    id: "",
  });

  const [toggle, setToggle] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [categories, setCategories] = useState<Array<any>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleDelete, setToggleDelete] = useState<boolean>(false);

  // function to check title duplication
  const checkTitle = async (title: string): Promise<boolean> => {
    try {
      const doc = await getPlans(); // Assuming getPlans() is a valid function that fetches documents

      if (doc?.docs !== undefined && doc?.docs.length > 0) {
        for (let i = 0; i < doc.docs.length; i++) {
          if (doc.docs[i].data().title == title) {
            if (id === doc.docs[i].id) return true;
            else return false;
          }
        }
        return true; // No matching title found
      } else {
        return true; // No documents found
      }
    } catch (error) {
      return true; // Error occurred
    }
  };

  const load = async () => {
    setLoading(true);
    await getDocument().then((doc) => {
      setCategories(doc?.docs);
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [toggle]);

  const onAddSubmit = async () => {
    try {
      if (await checkTitle(payload.title)) {
        if (
          payload.category.length >= 1 &&
          +payload.amount >= 1 &&
          payload.title.length >= 1
        ) {
          setLoading(true);
          addDocument({
            category: payload?.code,
            budgetAmount: payload?.amount,
            title: payload?.title,
            currentAmount: 0,
          }).then(() => {
            setToggle(false);
            props.navigation.goBack();
            setLoading(false);
            triggerNotifications("Plan", `#${payload?.title} is added.`);
            dispatch(reload());
          });

          return;
        } else {
          dispatch(set({ toggle: true, msg: "Fill all the fields correctly" }));
        }
      } else {
        triggerNotifications("Plan", `#${payload?.title} already exist.`);
      }
    } catch {}

    setOpenSnackbar(true);
  };

  async function onEditSubmit() {
    try {
      if (await checkTitle(payload.title)) {
        if (
          payload.category.length >= 1 &&
          +payload.amount >= 1 &&
          payload.title.length >= 1
        ) {
          await updateDocument(
            {
              budgetAmount: +payload?.amount!,
              title: payload?.title,
              category: payload.category,
            },
            id
          ).then(() => {
            props.navigation.goBack();
            triggerNotifications("Plan", `#${payload?.title} is updated.`);
            dispatch(reload());
          });
          return;
        }
      } else {
        triggerNotifications("Plan", `#${payload?.title} already exist.`);
      }
    } catch {}
    setOpenSnackbar(true);
  }

  const onDelete = async () => {
    deleteDocument(id).then(() => {
      props.navigation.goBack();
      dispatch(set({ toggle: true, msg: `#${payload.title} is removed` }));
      setLoading(false);
      triggerNotifications("Plan", `#${payload?.title} is removed`);
      dispatch(reload());
    });
  };

  return (
    <SafeAreaView>
      {/* Use the custom FadeInView component to apply fade-in animation */}
      <FadeInView _duration={150}>
        {/* Main content container */}
        <ScrollView>
          <View
            style={{
              // Apply background color based on the color scheme
              backgroundColor:
                colorScheme === "light"
                  ? "rgba(0, 0, 0, 0.2)" // Light mode background color
                  : "rgba(255, 255, 255, 0.2)", // Dark mode background color
            }}
            className="w-full flex justify-center items-center h-screen py-4 px-2"
          >
            {/* Content wrapper */}
            <View className="rounded-xl w-full pb-10 px-4 pt-8">
              {/* Header section */}
              <View
                style={{ backgroundColor: "transparent" }}
                className="flex flex-row justify-between items-center"
              >
                {/* Display the title as "New Plan" or show an edit icon */}
                <Text className="dark:text-white text-lg font-semibold">
                  {+title !== 0 ? ( // +(string) = number
                    <View className="flex justify-start items-center flex-row">
                      <Octicons
                        name="pencil"
                        size={24}
                        color={Colors[colorScheme ?? "light"].text}
                      />
                      <TouchableOpacity
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
                  ) : (
                    "New Plan"
                  )}
                </Text>
                {/* Close button to navigate back */}
                <TouchableOpacity
                  className="px-1 py-1"
                  onPress={() => props.navigation.goBack()}
                >
                  <Ionicons
                    name="close-sharp"
                    size={30}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                </TouchableOpacity>
              </View>

              {/* Title input section */}
              <View className="space-y-1 pt-5">
                <Text className="dark:text-white text-lg font-semibold">
                  Title
                </Text>
                {/* TextInput for entering the title */}
                <TextInput
                  className="py-2 px-3 dark:text-white rounded-lg"
                  style={{ borderColor: "grey", borderWidth: 2 }}
                  placeholder="e.g London Tour"
                  value={payload?.title}
                  placeholderTextColor="grey"
                  keyboardType="default"
                  onChangeText={(title) => setPayload({ ...payload, title })}
                />
              </View>

              {/* Budget amount input section */}
              <View className="space-y-1 pt-5">
                <Text className="dark:text-white text-lg font-semibold">
                  Budget Amount{" "}
                  <Text className="text-sm">(Limit: {currentBalance})</Text>
                </Text>
                {/* TextInput for entering the budget amount */}
                <TextInput
                  className="py-2 px-3 dark:text-white rounded-lg"
                  style={{ borderColor: "grey", borderWidth: 2 }}
                  placeholder="0"
                  value={payload?.amount}
                  placeholderTextColor="grey"
                  keyboardType="default"
                  onChangeText={(amount) => {
                    setPayload({ ...payload, amount });
                  }}
                />
              </View>

              {/* Category selection input section */}
              <View className="space-y-1 pb-3 pt-5">
                <Text className="dark:text-white text-lg font-semibold">
                  Choose Category
                </Text>
                {/* TextInput for choosing the category */}
                <TextInput
                  ref={ref}
                  onBlur={() => setToggle(false)}
                  onFocus={() => setToggle(true)}
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
                <View
                  className="pt-2 space-y-1"
                  style={{ display: toggle ? "flex" : "none", height: 100 }}
                >
                  {categories?.map((e, i) => (
                    <TouchableOpacity
                      onPress={() => {
                        ref.current?.blur();
                        setToggle(false);
                        setPayload({
                          ...payload,
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

              {/* Button to submit the form (Add or Edit) */}
              {+title !== 0 ? (
                <TouchableOpacity
                  onPress={() => onEditSubmit()}
                  disabled={loading}
                  className="flex justify-center items-center rounded-lg"
                  style={{
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                  }}
                >
                  <Text className="text-white py-3">Edit Plan</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => onAddSubmit()}
                  disabled={loading}
                  className="flex justify-center items-center rounded-lg"
                  style={{
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                  }}
                >
                  <Text className="text-white py-3">
                    {loading ? "Loading..." : "Add Plan"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </FadeInView>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={openSnackbar}
        onDismiss={() => setOpenSnackbar(false)}
        action={{
          label: "Ok",
          onPress: () => setOpenSnackbar(false),
        }}
      >
        Fields are empty
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
