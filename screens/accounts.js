import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { MotiView } from "moti";
import colors from "../assets/colors";
import Header from "../components/header";
const { width, height } = Dimensions.get("window");
import { LineChart } from "react-native-chart-kit";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Accounts = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        text="Book Keeper"
        handleArrowLeftPress={() => {
          navigation.navigate("Home");
        }}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}>
        <MaterialCommunityIcons
          name="bookshelf"
          size={25}
          color={colors.black}
        />

        <Text
          style={{
            color: colors.primary,
            fontFamily: "rgl",
          }}>
          Coming soon...
        </Text>
      </View>
    </View>
  );
};

export default Accounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
