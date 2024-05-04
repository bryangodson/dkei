import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import React, { Component } from "react";
import Header from "../components/header";
const { width, height } = Dimensions.get("window");
import colors from "../assets/colors";
export default class AboutApp extends Component {
  render() {
    return (
      <>
        <Header
          text="About App"
          handleArrowLeftPress={() => {
            this.props.navigation.navigate("Settings");
          }}
        />

        <View style={styles.container}>
          <Text style={styles.text}>Trecco</Text>
          <Image
            source={require("../assets/LOGO.png")}
            style={{
              width: 200,
              height: 200,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.text}>Version </Text>
            <Text style={styles.text}>1.0.0</Text>
          </View>

          <Text style={styles.text}>&#xA9; 2023 tremma agro services</Text>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height,
    backgroundColor: colors.white,
    width,
  },
  text: {
    fontFamily: "rgl",
    color: colors.black,
  },
});
