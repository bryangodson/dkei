import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { Component } from "react";

import colors from "../assets/colors";
import Header from "../components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");

export default class SecurityQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: "",
      word: "",
      mate: "",
      loading: false,
    };
  }

  upload = async () => {
    this.setState({ loading: true });
    const BASE_URL =
      "https://www.tremmaagroservices.com/trecco/app/securityQuestions.php";
    const data = new FormData();
    // appending the files to the formdata object
    const email = await AsyncStorage.getItem("email");

    data.append("place", this.state.place);
    data.append("word", this.state.word);
    data.append("mate", this.state.mate);
    data.append("email", email);
    try {
      // send the file to the server
      let res = await fetch(BASE_URL, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });
      // the server has returned some info here.
      if (res.ok) {
        let response = await res.text();
        // GETTING THE SERVER RESPONSE
        ToastAndroid.show(response, ToastAndroid.SHORT);
        this.setState({ loading: false });
        if (response === "Answers sent successfully!") {
          this.setState({ word: "" });
          this.setState({ place: "" });
          this.setState({ mate: "" });
        }
      } else {
        ToastAndroid.show(
          "ERR::check your internet connection ::" + res.status,
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      this.setState({ loading: false });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Header
          text="Security Questions"
          handleArrowLeftPress={() => {
            this.props.navigation.navigate("Settings");
          }}
        />
        <ScrollView>
          <StatusBar
            barStyle="dark-content"
            animated={true}
            translucent={true}
            backgroundColor="rgba(255,255,255,0.1)"
          />

          <View>
            <View>
              <Text style={styles.txt}>
                Answer these questions.{"\n"}Make sure you can remember all of
                them.{"\n"} We suggest you write your answers somewhere.
              </Text>
            </View>
            <TextInput
              style={styles.input}
              cursorColor={colors.black}
              placeholder="What is your favourite place..."
              returnKeyType="next"
              onChangeText={(text) => {
                this.setState({ place: text });
              }}
              value={this.state.place}
            />
            <TextInput
              style={styles.input}
              cursorColor={colors.black}
              placeholder="what is the word you use most..."
              returnKeyType="next"
              onChangeText={(text) => {
                this.setState({ word: text });
              }}
              value={this.state.word}
            />
            <TextInput
              style={styles.input}
              cursorColor={colors.black}
              placeholder="who was your first roomate?"
              returnKeyType="done"
              onChangeText={(text) => {
                this.setState({ mate: text });
              }}
              value={this.state.mate}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              if (
                this.state.word === "" ||
                this.state.mate === "" ||
                this.state.place === ""
              ) {
                ToastAndroid.show(
                  "Please fill all fields.",
                  ToastAndroid.SHORT
                );
              } else {
                this.upload();
              }
            }}
            style={styles.pay}
            disabled={this.state.loading}>
            <View>
              {!this.state.loading ? (
                <Text style={[styles.text, { color: colors.white }]}>
                  Submit answers
                </Text>
              ) : (
                <View style={styles.act}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: "rgl",
                      fontSize: colors.fontSmall,
                      marginRight: 5,
                    }}>
                    Sending please wait...
                  </Text>
                  <ActivityIndicator
                    animating={this.state.loading}
                    color={colors.white}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  txt: {
    fontSize: colors.fontSmall,
    lineHeight: 30,
    color: colors.black,
    opacity: 0.5,
    alignItems: "center",
    textAlign: "center",
    fontFamily: "rgl",
    marginVertical: 20,
  },
  text: {
    fontFamily: "rgl",
  },
  input: {
    width: width * 0.9,
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 13,
    marginBottom: 20,
    color: colors.black,
    borderWidth: 1,
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    textAlign: "left",
    borderColor: colors.white,
    elevation: 10,
    marginLeft: width * 0.05,
  },
  pay: {
    width: width - 40,
    height: 50,
    backgroundColor: colors.sec,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 20,
  },
  act: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
