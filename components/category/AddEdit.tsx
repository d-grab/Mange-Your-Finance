import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { FadeInView } from "../animations";
import { Text, View } from "../Themed";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useFirestore } from "../../firebase/useFirestore";
import { SetStateAction, useEffect, useState } from "react";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../../store/slices/snackSlice";
import { reload } from "../../store/slices/reloadSlice";
import { triggerNotifications } from "../../utils/Notifications";
import { Snackbar } from "react-native-paper";

export default function AddEdit({
  setToggle,
  payload,
  setPayload,
  isNew,
}: {
  isNew: boolean;
  payload: { id: string; category: string };
  setPayload: React.Dispatch<SetStateAction<{ id: string; category: string }>>;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);

  //
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleDelete, setToggleDelete] = useState<boolean>(false);

  const { addDocument, updateDocument, getDocument, deleteDocument } =
    useFirestore("categories", user.uid!);

  // check of there is a duplicate
  const checkName = async (code: string): Promise<boolean> => {
    try {
      const doc = await getDocument();
      if (doc?.docs !== undefined && doc?.docs.length > 0) {
        for (let i = 0; i < doc.docs.length; i++) {
          if (doc?.docs[i].data().code === code) {
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      return true;
    }
  };

  const Submit = async () => {
    try {
      if (payload?.category!.length >= 1) {
        if (await checkName(payload?.category)) {
          setLoading(true);
          addDocument({
            code: payload.category,
            description: payload.category,
          }).then(() => {
            setToggle(false);
            setLoading(false);
            triggerNotifications("Category", `#${payload?.category} is added`);
            dispatch(reload());
          });
        } else {
          triggerNotifications(
            "Category",
            `#${payload?.category} already exists.`
          );
        }
      } else {
        dispatch(set({ toggle: true, msg: "Field is empty" }));
      }
    } catch {
      setToggle(false);
      dispatch(set({ toggle: true, msg: "Please reload and again." }));
    }
  };

  const Update = async () => {
    try {
      if (payload.category.length >= 1) {
        setLoading(true);
        if (await checkName(payload?.category)) {
          updateDocument(
            {
              code: payload.category,
              description: payload.category,
            },
            payload.id
          ).then(() => {
            setToggle(false);
            setLoading(false);
            triggerNotifications(
              "Category",
              `#${payload?.category} is updated`
            );
            dispatch(reload());
          });
        } else {
          triggerNotifications(
            "Category",
            `#${payload?.category} already exists.`
          );
        }
      } else {
        dispatch(set({ toggle: true, msg: "Field is empty" }));
      }
    } catch {
      setToggle(false);
      dispatch(set({ toggle: true, msg: "Please reload and again." }));
    }
  };

  const onDelete = async () => {
    deleteDocument(payload.id).then(() => {
      dispatch(set({ toggle: true, msg: `#${payload.category} is removed` }));
      setToggle(false);
      setLoading(false);
      triggerNotifications("Category", `#${payload?.category} is removed`);
      dispatch(reload());
    });
  };

  return (
    <FadeInView _duration={150}>
      <View
        style={{
          backgroundColor:
            colorScheme === "light"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.2)",
        }}
        className="w-full flex justify-center items-center h-screen py-4 px-2"
      >
        <View className="rounded-xl w-full pb-10 px-4 pt-8">
          <View
            style={{ backgroundColor: "transparent" }}
            className="flex flex-row justify-between items-center"
          >
            <Text className="dark:text-white text-lg font-semibold">
              {!isNew ? (
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
                "New Category"
              )}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setToggle(false);
              }}
              className="px-1 py-1"
            >
              <Ionicons
                name="close-sharp"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          </View>
          <View className="space-y-1 pb-3 pt-5">
            <Text className="dark:text-white text-lg font-semibold">
              Description
            </Text>
            <TextInput
              className="py-2 px-3 dark:text-white rounded-lg"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="e.g shopping"
              placeholderTextColor="grey"
              value={payload.category}
              keyboardType="default"
              onChangeText={(category) => setPayload({ ...payload, category })}
            />
          </View>
          {isNew ? (
            <TouchableOpacity
              disabled={loading}
              onPress={() => Submit()}
              className="flex justify-center items-center rounded-lg"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text className="text-white py-3">Add Category</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={loading}
              onPress={() => Update()}
              className="flex justify-center items-center rounded-lg"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text className="text-white py-3">Edit Category</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Snackbar
        style={{ marginBottom: "20%" }}
        visible={toggleDelete}
        onDismiss={() => setToggleDelete(false)}
        action={{
          label: "Yes",
          onPress: async () => onDelete(),
        }}
      >
        Are you sure?
      </Snackbar>
    </FadeInView>
  );
}
