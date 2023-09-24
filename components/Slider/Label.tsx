import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

const Label = ({ text, ...restProps }: any) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{Number(text || 0).toFixed(2)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 8,
    backgroundColor: "#3b7250",
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
});

export default memo(Label);
