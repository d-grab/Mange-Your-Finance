// Import necessary components and libraries from react-native
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  useColorScheme,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useRef } from "react";

// Import custom components and constants
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";
import { FadeInView } from "../../components/animations";

// Get the device width and height using Dimensions
const { width, height } = Dimensions.get("window");

// Define the LoginScreen component
export default function LoginScreen(props: any) {
  // Create a reference to the FlatList component
  const flatListRef = useRef<FlatList>(null);

  // Get the current color scheme of the device
  const colorScheme = useColorScheme();

  return (
    // SafeAreaView ensures the UI fits within safe areas of different devices
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
    >
      {/* A custom animation component called FadeInView */}
      <FadeInView _duration={220}>
        <ScrollView>
          {/* FlatList to render Login and SignUp components horizontally */}
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={flatListRef}
            data={[
              {
                id: 1,
                e: (
                  <Login
                    navigation={props.navigation}
                    flatListRef={flatListRef}
                  />
                ),
              },
              { id: 2, e: <SignUp flatListRef={flatListRef} /> },
            ]}
            // Render each item in the FlatList
            renderItem={({ item }) => (
              <View
                className="flex-1 justify-end items-center px-2"
                style={styles.itemWrapper}
              >
                {item.e}
              </View>
            )}
            keyExtractor={(item) => `${item.id}`}
          />
        </ScrollView>
      </FadeInView>
    </SafeAreaView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  itemWrapper: {
    width: width,
    height,
  },
});
