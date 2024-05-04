import {
  Text,
  StyleSheet,
  View,
  Pressable,
  NativeModules,
  Dimensions,
} from "react-native";
import React, { Component } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "../assets/colors";
const barHeight = NativeModules.StatusBarManager.HEIGHT;
const { width } = Dimensions.get("window");
export default class Header extends Component {
  render() {
    return (
      <View style={styles.top}>
        <Pressable onPress={this.props.handleArrowLeftPress}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 8,
              borderRadius: 15,
            }}>
            <MaterialCommunityIcons
              name="arrow-left"
              color={colors.black}
              size={18}
              style={{
                marginRight: 20,
                // marginBottom: 3,
              }}
            />

            <View>
              <Text
                style={{
                  fontFamily: "bold",
                  fontSize: colors.fontMedium,
                  color: colors.black,
                }}>
                {this.props.text}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  top: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: barHeight + 10,
    paddingRight: 50,
    flexDirection: "row",
    width,
    borderRadius: 0,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.1)",
    backgroundColor: colors.white,
  },
  setText: {
    color: colors.white,
    fontSize: colors.fontMedium,
    fontFamily: "rgl",
  },
});
