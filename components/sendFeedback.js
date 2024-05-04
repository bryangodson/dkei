import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import React, { Component } from "react";
import colors from "../assets/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MotiView } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class SendFeedBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handlePress = this.handlePress.bind(this);
  }
  handlePress = async (which) => {
    this.setState({ loading: true });
    let type = "feedback on app";
    const email = await AsyncStorage.getItem("email");
    let like = which == "like" ? "like App" : "dislike App";
    let data = new FormData();
    data.append("text", like);
    data.append("email", email);
    data.append("type", type);
    try {
      const BASE_URL =
        "https://www.tremmaagroservices.com/trecco/app/sendFeedbacks.php";

      let res = await fetch(BASE_URL, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });
      if (res.ok) {
        let responseFromPayment = await res.json();
        ToastAndroid.show(responseFromPayment.message, ToastAndroid.SHORT);
        this.setState({ text: "" });
        this.setState({ loading: false });
      } else {
        ToastAndroid.show(
          "ERR::something wrong happened ::" + res.status,
          ToastAndroid.SHORT
        );
        this.setState({ loading: false });
      }
    } catch (error) {
      ToastAndroid.show("error: " + error, ToastAndroid.SHORT);
      this.setState({ loading: false });
    }
  };
  render() {
    return (
      <MotiView
        from={{
          transform: [{ scale: 0 }],
        }}
        animate={{
          transform: [{ scale: 1 }],
        }}
        transition={{
          duration: 450,
          type: "spring",
        }}
        style={styles.component}>
        <Text style={styles.feedText}>How are you enjoying our app?</Text>
        <View style={styles.icons}>
          <TouchableOpacity
            style={{
              marginHorizontal: 10,
            }}
            onPress={() => this.handlePress("like")}>
            <MaterialCommunityIcons
              name="emoticon-happy-outline"
              color={colors.black}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginHorizontal: 10,
            }}
            onPress={() => this.handlePress("dislike")}>
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              color={colors.black}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </MotiView>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 5,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  feedText: {
    color: colors.black,
    fontFamily: "rgl",
    fontSize: colors.fontSmall,
  },
});
