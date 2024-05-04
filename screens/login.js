import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  NativeModules,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  ToastAndroid,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React, { Component } from "react";
import colors from "../assets/colors";
const { width, height } = Dimensions.get("window");
import { MotiView } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
const stat = NativeModules.StatusBarManager.HEIGHT;
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      results: "",
      currentAction: "Validating Previous Logins",
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  handleSignUp = () => {
    this.props.navigation.navigate("SignUp");
  };
  handleLogin = () => {
    try {
      Keyboard.dismiss();
      const xhr = new XMLHttpRequest();
      this.setState({ loading: true });
      this.setState({
        currentAction: "Logging you in...",
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = xhr.responseText;
          if (response === "Login Succesfull") {
            this.setState({ loading: false });
            this.setState({ email: this.state.email });
            ToastAndroid.show(response, ToastAndroid.SHORT);
            let em = async () => {
              await AsyncStorage.setItem("email", this.state.email);
              await AsyncStorage.setItem("loggedIn", "true");
            };
            em();

            this.props.navigation.navigate("Tabs");
            this.setState({ email: "" });
            this.setState({ password: "" });
          } else {
            this.setState({ loading: false });
            ToastAndroid.show(response, ToastAndroid.SHORT);
          }
        }
      };
      xhr.addEventListener("error", () => {
        ToastAndroid.show(
          "Request Failed. Please check your internet connection",
          ToastAndroid.SHORT
        );
      });
      xhr.open(
        "POST",
        "https://www.tremmaagroservices.com/trecco/app/login.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(`email=${this.state.email}&password=${this.state.password}`);
    } catch (error) {
      this.setState({ loading: false });
    } finally {
      setTimeout(() => {
        this.setState({ loading: false });
        ToastAndroid.show("Request Time out", ToastAndroid.SHORT);
      }, 6000 * 2.5);
    }
  };

  componentDidMount() {
    let getData = async () => {
      this.setState({ loading: true });
      let loggedIn = await AsyncStorage.getItem("loggedIn");
      let firstOpen = await AsyncStorage.getItem("firstOpen");
      if (loggedIn !== null) {
        setTimeout(() => {
          this.setState({ currentAction: "Login Vaidated" });
          this.setState({ loading: false });
          this.props.navigation.navigate("Tabs");
        }, 2000);
      }
      if (loggedIn === null && firstOpen === null) {
        setTimeout(() => {
          this.setState({ currentAction: "Seems like you are new, Welcome" });
          this.setState({ loading: false });
          this.props.navigation.navigate("Onboard");
        }, 2000);
      }
      if (loggedIn === null && firstOpen !== null) {
        this.setState({ loading: false });
        SplashScreen.hideAsync();
        this.setState({ currentAction: "Your are not logged in." });
      }
    };
    getData();
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={styles.container}>
        <View
          style={{
            position: "absolute",
            bottom: 60,
            zIndex: 100,
          }}>
          <Text
            style={{
              color: colors.black,
              fontFamily: "rgl",
            }}>
            {this.state.loading ? this.state.currentAction : " "}
          </Text>
          <ActivityIndicator
            animating={this.state.loading}
            size={50}
            color={colors.black}
          />
        </View>
        <MotiView
          from={{
            transform: [{ translateX: -width }],
            opacity: 0,
          }}
          animate={{
            transform: [{ translateX: 0 }],
            opacity: 1,
          }}>
          <StatusBar
            barStyle="dark-content"
            animated={true}
            translucent={true}
            backgroundColor="rgba(255,255,255,0.1)"
          />

          <ImageBackground
            source={require("../assets/humans.png")}
            style={{
              width,
              height,
            }}
            resizeMode="cover"
            blurRadius={40}>
            <View
              style={{
                paddingHorizontal: 30,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Image
                source={require("../assets/humans.png")}
                style={styles.image}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 30,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text style={styles.text}>Welcome Back</Text>
              <Text style={styles.txt}>Login to your acount to do more</Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
                padding: 30,
              }}>
              <View>
                <TextInput
                  style={styles.input}
                  cursorColor={colors.black}
                  placeholder="Enter email..."
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    this.setState({ email: text });
                  }}
                  value={this.state.email}
                />
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  cursorColor={colors.black}
                  secureTextEntry={true}
                  placeholder="Enter password..."
                  onChangeText={(text) => {
                    this.setState({ password: text });
                  }}
                  value={this.state.password}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  width: width - 40,
                  justifyContent: "space-between",
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={this.handleSignUp}
                  style={styles.button}>
                  <Text style={styles.btnText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.handleLogin}
                  style={[
                    styles.button,
                    {
                      backgroundColor: this.state.loading ? "grey" : colors.sec,
                      borderColor: this.state.loading ? "grey" : colors.sec,
                      opacity: this.state.loading ? 0.5 : 1,
                    },
                  ]}
                  disabled={this.state.loading}>
                  <Text style={[styles.btnText, { color: colors.white }]}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </MotiView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: stat,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  image: {
    width: width,
    transform: [{ scale: 0.6 }],
  },
  text: {
    fontSize: colors.fontMedium,
    fontFamily: "bold",
    color: colors.sec,
  },
  txt: {
    fontSize: colors.fontSmall,
    // lineHeight: 30,
    color: colors.black,
    marginLeft: 1,
    opacity: 0.5,
    alignItems: "center",
    fontFamily: "rgl",
  },
  input: {
    width: width * 0.9,
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 13,
    marginBottom: 10,
    color: colors.black,
    borderWidth: 1,
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    textAlign: "left",
    borderColor: colors.white,
    elevation: 10,
  },
  button: {
    width: (width - 80) / 2,
    borderColor: colors.black,
    borderWidth: 1,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  btnText: {
    fontFamily: "rgl",
    color: colors.black,
  },
});
