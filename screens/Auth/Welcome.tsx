import { useRef, useState } from "react";
import {
  View,
  useColorScheme,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";

// Importing constants and components
import Colors from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Slide1 from "../../components/welcome_screen/Slide1";
import Slide2 from "../../components/welcome_screen/Slide2";
import Slide3 from "../../components/welcome_screen/Slide3";
import { ScrollView } from "react-native";

// Getting the device width
const { width, height } = Dimensions.get("window");
// MainScreen component
export default function WelcomeScreen(props: any) {
  // Getting the color scheme of the device (light/dark)
  const colorScheme = useColorScheme();

  // Creating a reference to the FlatList component
  const flatListRef = useRef<FlatList>(null);
  const [cIndex, setCIndex] = useState<number>(0);

  // Rendering the main view
  return (
    <SafeAreaView>
      {/* Outer container with a flex layout */}
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: "100%",
        }}
      >
        <View className="flex justify-start items-start">
          {/* FlatList to display slides */}
          <FlatList
            ref={flatListRef}
            horizontal
            style={{
              height:
                height > 700
                  ? height / 1.1
                  : height < 620
                  ? height / 1.14
                  : "auto",
            }}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              // Updating the current index based on the scroll position
              const x = e.nativeEvent.contentOffset.x;
              setCIndex(+(x / width).toFixed(0));
            }}
            data={[
              { id: 1, e: <Slide1 /> },
              { id: 2, e: <Slide2 /> },
              { id: 3, e: <Slide3 navigation={props.navigation} /> },
            ]}
            renderItem={({ item }) => (
              <View
                style={{ width }}
                className="flex justify-start items-start"
              >
                {item.e}
              </View>
            )}
            keyExtractor={(item) => `${item.id}`}
          />
          {/* Pagination dots at the bottom */}
          <View
            style={{ height: height / 12 }}
            className="flex-row w-full flex justify-between items-center self-end pl-3"
          >
            {/* "SKIP" text (initially hidden) for style only */}
            <Text className="opacity-0">SKIP</Text>
            {/* Pagination dots container */}
            <View className="flex-row flex justify-center items-center space-x-1">
              {[0, 1, 2]?.map((e) => {
                return (
                  <TouchableOpacity
                    key={e}
                    onPress={() =>
                      flatListRef.current?.scrollToIndex({
                        animated: true,
                        index: e,
                      })
                    }
                    className="rounded-full"
                    style={{
                      height: cIndex === e ? 9 : 5,
                      width: cIndex === e ? 9 : 5,
                      backgroundColor:
                        cIndex === e
                          ? Colors[colorScheme ?? "light"].tint
                          : "#D3D3D3",
                    }}
                  ></TouchableOpacity>
                );
              })}
            </View>
            {/* "SKIP" button */}
            <TouchableOpacity
              disabled={cIndex === 2 ? true : false}
              style={{ opacity: cIndex === 2 ? 0 : 1 }}
              className="py-3 px-3"
              onPress={() => {
                try {
                  flatListRef.current?.scrollToIndex({
                    animated: true,
                    index: 2,
                  });
                } catch (e) {}
              }}
            >
              <Text style={{ color: "#767676" }}>SKIP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
