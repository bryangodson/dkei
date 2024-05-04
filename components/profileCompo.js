import { Text, StyleSheet, View, Dimensions } from "react-native";
import React, { Component } from "react";
import colors from "../assets/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");

export default class ProfileCompo extends Component {
  render() {
    return (
      <View style={styles.compView}>
        <View style={styles.left}>
          <MaterialCommunityIcons
            name={this.props.icon}
            color={colors.black}
            size={18}
            style={{
              margin: 0,
              padding: 0,
            }}
          />
          <View
            style={{
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              flexShrink: 1,
            }}>
            <Text style={styles.text}>{this.props.title}</Text>
            <Text
              style={{
                opacity: 0.5,
                fontSize: colors.fontTiny,
                color: "grey",
                marginLeft: 10,
                fontFamily: "rgl",
                width: width - 100,
              }}>
              {this.props.value}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  left: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  text: {
    marginLeft: 10,
    color: colors.black,
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    opacity: 0.8,
  },
  compView: {
    width: width - 40,
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    marginVertical: 20,
    marginLeft: 20,
    borderRadius: 5,
  },
});
