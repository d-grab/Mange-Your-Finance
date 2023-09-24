import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

const THUMB_RADIUS_LOW = 11;
const THUMB_RADIUS_HIGH = 16;

const Thumb = ({ name }: { name: any }) => {
  return <View style={name === "high" ? styles.rootHigh : styles.rootLow} />;
};

const styles = StyleSheet.create({
  rootLow: {
    width: THUMB_RADIUS_LOW * 2,
    height: THUMB_RADIUS_LOW * 2,
    borderRadius: THUMB_RADIUS_LOW,
    borderWidth: 2,
    borderColor: "#3b7250",
    backgroundColor: "#3b7250",
  },
  rootHigh: {
    width: THUMB_RADIUS_HIGH * 2,
    height: THUMB_RADIUS_HIGH * 2,
    borderRadius: THUMB_RADIUS_HIGH,
    borderWidth: 2,
    borderColor: "#3b7250",
    backgroundColor: "#ffffff",
  },
});

export default memo(Thumb);
