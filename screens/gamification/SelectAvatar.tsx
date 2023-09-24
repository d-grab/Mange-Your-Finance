import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { Avatars } from "../../gamification/Avatars/_Paths";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { setAvatar } from "../../store/slices/avatarSlice";
import { FadeInView } from "../../components/animations";
import { useFirestore } from "../../firebase/useFirestore";

export default function SelectAvatar(props: any) {
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);
  const { id, path } = useSelector((state: RootState) => state.avatar);
  const dispatch = useDispatch();

  //
  const [loading, setLoading] = useState<boolean>(false);
  const [leadersBoardSaving, setLeadersBoardSaving] = useState<{
    saving: number;
    id: string;
  }>();

  //
  const { updateDocument } = useFirestore("gamification", user.uid!);
  const { updateDocument: updateLeadersBoard, getDocument: getLeaderBoard } =
    useFirestore("leadersboard", user.uid!);

  const handleSubmit = async (e: { title: string; uri: string }) => {
    setLoading(true);
    await updateDocument({ avatar: e.title }, id!);
    leadersBoardSaving?.id != undefined &&
      (await updateLeadersBoard({ avatar: e.uri }, leadersBoardSaving?.id));
    dispatch(setAvatar({ path: e.uri, id }));

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

  return (
    <SafeAreaView>
      <FadeInView _duration={500}>
        <ScrollView
          style={{
            height: "100%",
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}
        >
          <View className="w-full flex flex-row justify-start items-center pt-4">
            <TouchableOpacity
              className="py-4 px-3"
              onPress={() => props.navigation.goBack()}
            >
              <Ionicons
                name="chevron-back-sharp"
                size={26}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
            <Text className="text-xl flex-1 pl-3 font-bold tracking-wider text-start py-4">
              Avatar
            </Text>
          </View>
          {
            <>
              <View className="w-full justify-center items-center flex pt-5">
                {loading ? (
                  <Image
                    className="rounded-full"
                    style={{
                      width: 120,
                      height: 120,
                      resizeMode: "stretch",
                    }}
                    source={require("../../assets/loading.gif")}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("FullScreenAvatar")
                    }
                  >
                    <Image
                      className="rounded-full"
                      style={{
                        width: 120,
                        height: 120,
                        resizeMode: "stretch",
                      }}
                      source={path}
                    />
                  </TouchableOpacity>
                )}
                {/*  */}
              </View>
              <View className="px-2 pt-5 pb-5">
                <View
                  className="justify-between rounded-2xl"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    backgroundColor:
                      Colors[colorScheme ?? "light"].secondaryBackground,
                  }}
                >
                  {Avatars.map((e, i) => {
                    return (
                      <TouchableOpacity
                        disabled={loading}
                        key={i}
                        onLongPress={() =>
                          props.navigation.navigate("FullScreenAvatar", {
                            avatar: e.uri,
                          })
                        }
                        onPress={() => handleSubmit(e)}
                        className="mx-4 my-5"
                      >
                        <Image
                          className="rounded-full"
                          style={{
                            width: 70,
                            height: 70,
                            resizeMode: "stretch",
                          }}
                          source={e.uri}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </>
          }
        </ScrollView>
      </FadeInView>
    </SafeAreaView>
  );
}
