import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { buttonIcons, buttons } from "../../utils/FinancialEdu";
import LinearGradient from "react-native-linear-gradient";

export default function FinancialHome(props: any) {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <LinearGradient
          colors={[
            "#fff", // Darker teal green
            "#007700",
            "#fff" // Dark green
          ]}
          style={{ paddingBottom: 200 }}
        >
          {/* Your content */}
          <View style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }}>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => props.navigation.goBack()}
            >
              <Ionicons
                name="chevron-back-sharp"
                size={26}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: "bold", flex: 1, paddingLeft: 10, color: "black" }}>
              Financial Education
            </Text>
          </View>
          
          <View style={{ paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 }}>
            
            {buttons?.map((e, i) => (
              
             <TouchableOpacity
             style={{
               backgroundColor: "#03450a", // Background color for tiles
               borderRadius: 12,
               flexDirection: "row",
               justifyContent: "space-between",
               alignItems: "center",
               marginBottom: 20,
               padding: 20,
             }}
                onPress={() =>
                  props.navigation.navigate("FinancialContent", {
                    slug: e.slug,
                    title: e.title,
                  })
                }
              >
                <View style={{ width: "75%" }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {e.title}
                  </Text>
                </View>
                <Image
                  style={{ width: 80, height: 80, resizeMode: "cover" }}
                  source={buttonIcons[i]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}