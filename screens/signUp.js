import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  NativeModules,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Keyboard,
  ToastAndroid,
} from "react-native";
import React, { Component } from "react";

import colors from "../assets/colors";
const { width, height } = Dimensions.get("window");
import Header from "../components/header";
import { MotiView } from "moti";
import * as WebBrowser from "expo-web-browser";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      cooperativeToken: "",
      password: "",
      passwordConfirm: "",
      loading: false,
      ballWay: 0,
    };

    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp = () => {
    try {
      Keyboard.dismiss();
      const xhr = new XMLHttpRequest();
      this.setState({ loading: true });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = xhr.responseText;
          if (response === "Registration successfull!") {
            this.setState({ loading: false });

            ToastAndroid.show(response, ToastAndroid.SHORT);
            this.gotoLogin();
            this.setState({ email: "" });
            this.setState({ password: "" });
            this.setState({ firstName: "" });
            this.setState({ lastName: "" });
            this.setState({ cooperativeToken: "" });
            this.setState({ password: "" });
            this.setState({ passwordConfirm: "" });
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
        "https://www.tremmaagroservices.com/trecco/app/signUp.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(
        `email=${this.state.email}&password=${this.state.password}&cooperativeToken=${this.state.cooperativeToken}&firstName=${this.state.firstName}&lastName=${this.state.lastName}&passwordConfirm=${this.state.passwordConfirm}`
      );
    } catch (error) {
      this.setState({ loading: false });
    } finally {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 6000 * 2.5);
    }
  };
  gotoLogin = () => {
    this.props.navigation.navigate("Login");
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          animated={true}
          translucent={true}
          backgroundColor="rgba(255,255,255,0.1)"
        />
        <Header text="Sign Up" handleArrowLeftPress={this.gotoLogin} />
        <MotiView
          style={{
            position: "absolute",
            bottom: -height * 0.4,
            right: 40,
            width: 120,
            marginRight: width * 0.4,
            justifyContent: "space-between",
            bottom: 10,
            zIndex: 2,
            flexDirection: "row",
          }}
          from={{
            transform: [{ translateX: width - 100 }],
          }}
          animate={{
            transform: [{ translateX: 0 }],
          }}>
          <View
            style={{
              width: 120,
              height: 2,
              borderRadius: 15,
              backgroundColor: colors.sec,
              position: "absolute",
              bottom: 8,
            }}></View>
          <View
            style={{
              flexDirection: "row",
              width: 120,
              justifyContent: "space-between",
            }}>
            {/* track bar  */}
            <MotiView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: colors.sec,
                borderWidth: 0.5,
                borderColor: colors.sec,
                position: "absolute",
                zIndex: 3,
              }}
              animate={{
                left: this.state.ballWay,
              }}></MotiView>
            <MotiView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor:
                  this.state.ballWay > 0 ? colors.sec : colors.white,
                borderWidth: 1,
                borderColor: colors.sec,
              }}></MotiView>
            <MotiView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor:
                  this.state.ballWay > 60 ? colors.sec : colors.white,
                borderWidth: 1,
                borderColor: colors.sec,
              }}></MotiView>
            <MotiView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor:
                  this.state.ballWay > 100 ? colors.sec : colors.white,
                borderWidth: 1,
                borderColor: colors.sec,
              }}></MotiView>
          </View>
        </MotiView>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
          scrollEventThrottle={100}
          onScroll={(event) => {
            let scroll = (this.xOffset = event.nativeEvent.contentOffset.x);

            // if (scroll < width) {
            //   //    first areans

            // } else if (scroll > width) {
            //   //    second arena
            // } else {
            // }
            let screen = width * 2;
            let final = (scroll / screen) * 100;
            this.setState({ ballWay: final });
          }}>
          {/* first sets of registration details */}
          <MotiView
            style={styles.container}
            from={{
              transform: [{ translateX: -width }],
            }}
            animate={{
              transform: [{ translateX: 0 }],
            }}>
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
                  paddingTop: 20,
                }}>
                <Text style={styles.text}>We are happy you are here.</Text>
                <Text style={styles.txt}>
                  Join us by fillng out your details
                </Text>
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
                    placeholder="First Name..."
                    keyboardType="default"
                    onChangeText={(text) => {
                      this.setState({ firstName: text });
                    }}
                    value={this.state.firstName}
                  />
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="Last Name..."
                    onChangeText={(text) => {
                      this.setState({ lastName: text });
                    }}
                    value={this.state.lastName}
                  />
                </View>
              </View>
            </ImageBackground>
          </MotiView>
          {/* second set of registration details */}
          <MotiView
            style={styles.container}
            from={{
              transform: [{ translateX: -width }],
            }}
            animate={{
              transform: [{ translateX: 0 }],
            }}>
            <StatusBar
              barStyle="dark-content"
              animated={true}
              translucent={true}
              backgroundColor={colors.white}
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
                  paddingTop: 20,
                }}>
                <Text style={styles.text}>You are almost done</Text>
                <Text style={styles.txt}>
                  Provide your email and registration token
                </Text>
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
                    placeholder="Email..."
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
                    placeholder="Your cooperative token..."
                    onChangeText={(text) => {
                      this.setState({ cooperativeToken: text });
                    }}
                    value={this.state.cooperativeToken}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    width: width - 40,
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}></View>
              </View>
            </ImageBackground>
          </MotiView>
          {/* las set of reigstrion details  */}
          <MotiView
            style={styles.container}
            from={{
              transform: [{ translateX: -width }],
            }}
            animate={{
              transform: [{ translateX: 0 }],
            }}>
            <StatusBar
              barStyle="dark-content"
              animated={true}
              translucent={true}
              backgroundColor={colors.white}
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
                  paddingTop: 20,
                }}>
                <Text style={styles.text}>
                  Your are a click away from joining us.
                </Text>
                <Text style={styles.txt}>
                  Secure your account with a password.
                </Text>
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
                    placeholder="Enter a password"
                    keyboardType="default"
                    secureTextEntry={true}
                    onChangeText={(text) => {
                      this.setState({ password: text });
                    }}
                    value={this.state.password}
                  />
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    secureTextEntry={true}
                    placeholder="Confirm your password..."
                    onChangeText={(text) => {
                      this.setState({ passwordConfirm: text });
                    }}
                    value={this.state.passwordConfirm}
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
                    disabled={this.state.loading}
                    style={[
                      styles.button,
                      {
                        backgroundColor: this.state.loading
                          ? "grey"
                          : colors.sec,
                        opacity: this.state.loading ? 0.5 : 1,
                      },
                    ]}>
                    {this.state.loading ? (
                      <ActivityIndicator
                        animating={this.state.loading}
                        size={30}
                        color={colors.primary}
                      />
                    ) : (
                      <Text style={styles.btnText}>Sign Up</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.terms}>
                  <Text
                    style={[
                      styles.txt,
                      {
                        opacity: 0.4,
                      },
                    ]}>
                    By signing up you agree to trecco.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      WebBrowser.openBrowserAsync(
                        "https://www.tremmaagroservices.com/Terms_And_Conditions"
                      );
                    }}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          opacity: 0.4,
                          color: colors.links,
                        },
                      ]}>
                      trems of service
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </MotiView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width,
    height,
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
  },
  button: {
    width: width * 0.5,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginLeft: width * 0.5 - 40,
    marginTop: 0,
  },
  btnText: {
    fontFamily: "rgl",
    color: colors.white,
  },
  terms: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
