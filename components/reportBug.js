import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { Component } from "react";
import colors from "../assets/colors";
import { MotiView } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class ReportBug extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }
  handleChange(txt) {
    this.setState({ text: txt });
  }
  handlePress = async () => {
    this.setState({ loading: true });
    let type = this.props.type;
    const email = await AsyncStorage.getItem("email");
    // const data = {
    //   text: this.state.text,
    //   type,
    //   email,
    // };
    let data = new FormData();
    data.append("text", this.state.text);
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
        style={styles.report}>
        <Text style={styles.reportText}>Tell us the problem...</Text>

        <TextInput
          onChangeText={this.handleChange}
          style={styles.TextInput}
          multiline={true}
          cursorColor={colors.black}
          placeholder="Type your problem and press send "
          returnKeyType="done"
          maxLength={200}
          value={this.state.text}
        />
        <TouchableOpacity onPress={this.handlePress} style={styles.button}>
          <Text style={styles.sendText}>
            {this.state.loading ? (
              <ActivityIndicator
                animating={this.state.loading}
                size={30}
                color={colors.primary}
              />
            ) : (
              "Send"
            )}
          </Text>
        </TouchableOpacity>
      </MotiView>
    );
  }
}

const styles = StyleSheet.create({
  report: {
    width: "100%",
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 5,
    alignItems: "flex-start",
    backgroundColor: colors.white,
    flexDirection: "column",
  },
  reportText: {
    fontFamily: "rgl",
    fontSize: colors.fontSmall,
    color: colors.black,
  },
  TextInput: {
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.black,
    marginTop: 10,
    alignSelf: "flex-end",
    borderRadius: 30,
  },
  sendText: {
    color: colors.black,
    fontFamily: "rgl",
    fontSize: colors.fontSmall,
  },
});
